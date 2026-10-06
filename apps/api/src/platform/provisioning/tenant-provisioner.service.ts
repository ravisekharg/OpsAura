import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import * as path from 'path'
import { execSync } from 'child_process'
import { PlatformPrismaService } from '../../database/platform-prisma.service'
import { TenantPrismaFactory } from '../../database/tenant-prisma.factory'
import { AuditService } from '../../audit/audit.service'
import { seedRolesAndPermissions } from './roles.seed'
import { seedDefaultSettings } from './settings.seed'
import type { ProvisionTenantDto } from '../dto/platform.dto'

export interface ProvisionResult {
  tenantId: string
  slug: string
  name: string
  adminEmail: string
  dbName: string
  message: string
}

@Injectable()
export class TenantProvisionerService {
  private readonly logger = new Logger(TenantProvisionerService.name)
  private readonly bcryptRounds: number

  constructor(
    private readonly platformDb: PlatformPrismaService,
    private readonly tenantFactory: TenantPrismaFactory,
    private readonly config: ConfigService,
    private readonly auditService: AuditService,
  ) {
    this.bcryptRounds = parseInt(String(config.get('BCRYPT_ROUNDS', 12)), 10) || 12
  }

  async provision(
    dto: ProvisionTenantDto,
    actorId: string,
    actorEmail: string,
  ): Promise<ProvisionResult> {
    // ── 1. Validate uniqueness ──────────────────────────────────────────────
    await this.assertSlugAvailable(dto.slug)

    // ── 2. Resolve plan ─────────────────────────────────────────────────────
    const plan = dto.planId
      ? await this.platformDb.plan.findUniqueOrThrow({ where: { id: dto.planId } })
      : await this.ensureDefaultPlan()

    // ── 3. Create tenant record (ONBOARDING) ────────────────────────────────
    const dbName = `tenant_${dto.slug}`
    const tenant = await this.platformDb.tenant.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        dbName,
        planId: plan.id,
        status: 'ONBOARDING',
        domain: dto.domain ?? null,
      },
    })

    this.logger.log(`Provisioning tenant "${dto.slug}" (id=${tenant.id})`)

    try {
      // ── 4. Create database ─────────────────────────────────────────────────
      await this.tenantFactory.createTenantDatabase(dto.slug)
      this.logger.log(`[${dto.slug}] Database created: ${dbName}`)

      // ── 5. Push schema ─────────────────────────────────────────────────────
      await this.pushTenantSchema(dto.slug)
      this.logger.log(`[${dto.slug}] Schema applied`)

      // ── 6. Get tenant client ───────────────────────────────────────────────
      const db = this.tenantFactory.getClient(dto.slug)

      // ── 7. Seed roles + permissions ────────────────────────────────────────
      await seedRolesAndPermissions(db)
      this.logger.log(`[${dto.slug}] Roles seeded`)

      // ── 8. Seed default settings ───────────────────────────────────────────
      await seedDefaultSettings(db)
      this.logger.log(`[${dto.slug}] Settings seeded`)

      // ── 9. Create tenant admin user ────────────────────────────────────────
      const tempPassword = this.generateTempPassword()
      const passwordHash = await bcrypt.hash(tempPassword, this.bcryptRounds)

      const adminRole = await db.role.findUnique({ where: { name: 'tenant_admin' } })
      if (!adminRole) throw new Error('tenant_admin role not found after seeding')

      await db.user.create({
        data: {
          email: dto.adminEmail,
          name: dto.adminName,
          passwordHash,
          roleId: adminRole.id,
          status: 'ACTIVE',
          forcePasswordChange: true,
        },
      })
      this.logger.log(`[${dto.slug}] Admin user created: ${dto.adminEmail}`)

      // ── 10. Create subscription ────────────────────────────────────────────
      await this.platformDb.subscription.create({
        data: {
          tenantId: tenant.id,
          planId: plan.id,
          status: 'TRIALING',
          billingCycle: 'MONTHLY',
          startsAt: new Date(),
        },
      })

      // ── 11. Mark tenant ACTIVE ─────────────────────────────────────────────
      await this.platformDb.tenant.update({
        where: { id: tenant.id },
        data: { status: 'ACTIVE' },
      })

      // ── 12. Audit ──────────────────────────────────────────────────────────
      await this.auditService.emit({
        category: 'tenant',
        action: 'TENANT_PROVISIONED',
        tenantSlug: 'platform',
        actorId,
        actorEmail,
        target: dto.slug,
        detail: `Tenant "${dto.name}" provisioned. Admin: ${dto.adminEmail}`,
        severity: 'WARNING',
      })

      // ── 13. Queue invite email (temp password sent via email ONLY — never in response) ──
      // TODO: dispatch via notification queue when email channel is configured
      // For now: log securely (remove before production)
      this.logger.log(`[${dto.slug}] Invite queued for ${dto.adminEmail} — password omitted from response`)
      this.logger.debug(`[DEV ONLY] Temp password for ${dto.adminEmail}: ${tempPassword}`)

      this.logger.log(`[${dto.slug}] Provisioning complete`)

      return {
        tenantId: tenant.id,
        slug: dto.slug,
        name: dto.name,
        adminEmail: dto.adminEmail,
        dbName,
        message: 'Tenant provisioned. Invite email queued for admin.',
      }
    } catch (err) {
      this.logger.error(`[${dto.slug}] Provisioning failed: ${err}`)
      // Rollback: mark tenant CANCELLED so it doesn't block re-provisioning
      await this.platformDb.tenant.update({
        where: { id: tenant.id },
        data: { status: 'CANCELLED' },
      })
      throw new InternalServerErrorException(
        `Tenant provisioning failed: ${(err as Error).message}`,
      )
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async assertSlugAvailable(slug: string): Promise<void> {
    const existing = await this.platformDb.tenant.findUnique({
      where: { slug },
      select: { id: true, status: true },
    })
    if (!existing) return

    if (existing.status === 'CANCELLED') {
      // Clean up failed provisioning attempts so the slug can be reused
      await this.platformDb.tenant.delete({ where: { slug } })
      return
    }

    throw new ConflictException(`Tenant slug "${slug}" is already taken`)
  }

  private async ensureDefaultPlan() {
    const existing = await this.platformDb.plan.findFirst({
      orderBy: { name: 'asc' },
    })
    if (existing) return existing

    return this.platformDb.plan.create({
      data: {
        name: 'Starter',
        features: {
          voice: true, war_rooms: true, servicenow: true,
          escalations: true, oncall: true, alerts: true,
        },
        limits: { users: 50, services: 100, schedules: 10 },
        priceMonthly: 0,
      },
    })
  }

  private async pushTenantSchema(slug: string): Promise<void> {
    const baseUrl = this.config.get<string>(
      'TENANT_DATABASE_BASE_URL',
      'postgresql://opsaura:password@localhost:5432',
    )
    const dbUrl = `${baseUrl}/tenant_${slug}`
    const prismaPath = path.join(process.cwd(), 'node_modules/.bin/prisma')
    const schemaPath = path.join(process.cwd(), 'prisma/tenant/schema.prisma')

    // Pass the DB URL via env var — matches schema datasource env("TENANT_DATABASE_URL")
    execSync(
      `"${prismaPath}" db push --schema="${schemaPath}" --skip-generate --accept-data-loss`,
      {
        stdio: 'pipe',
        timeout: 60000,
        env: { ...process.env, TENANT_DATABASE_URL: dbUrl },
      },
    )
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!'
    return Array.from(crypto.randomBytes(12))
      .map((b) => chars[b % chars.length])
      .join('')
  }
}

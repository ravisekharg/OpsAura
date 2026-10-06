import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { TenantPrismaFactory } from '../database/tenant-prisma.factory'
import { PlatformPrismaService } from '../database/platform-prisma.service'
import type { AuditEventPayload } from './interfaces/audit-event.interface'

const PLATFORM_TENANT_SLUG = 'platform'

@Processor('audit-events')
export class AuditProcessor {
  private readonly logger = new Logger(AuditProcessor.name)

  constructor(
    private readonly tenantFactory: TenantPrismaFactory,
    private readonly platformDb: PlatformPrismaService,
  ) {}

  @Process('persist')
  async handlePersist(job: Job<AuditEventPayload>): Promise<void> {
    const event = job.data

    try {
      if (event.tenantSlug === PLATFORM_TENANT_SLUG) {
        await this.writePlatformAudit(event)
      } else {
        await this.writeTenantAudit(event)
      }
    } catch (err) {
      this.logger.error(
        `Failed to persist audit event [${event.action}] for tenant [${event.tenantSlug}]`,
        err,
      )
      throw err // BullMQ will retry per the job options
    }
  }

  private async writeTenantAudit(event: AuditEventPayload): Promise<void> {
    const db = this.tenantFactory.getClient(event.tenantSlug)

    await db.auditEvent.create({
      data: {
        category: event.category,
        action: event.action,
        actorId: event.actorId ?? null,
        actorEmail: event.actorEmail ?? null,
        target: event.target ?? null,
        detail: event.detail ?? null,
        severity: event.severity ?? 'INFO',
        ipAddress: event.ipAddress ?? null,
        userAgent: event.userAgent ?? null,
      },
    })
  }

  private async writePlatformAudit(event: AuditEventPayload): Promise<void> {
    await this.platformDb.globalAudit.create({
      data: {
        actorId: event.actorId ?? null,
        actorEmail: event.actorEmail ?? null,
        action: event.action,
        target: event.target ?? null,
        detail: event.detail ?? null,
        ipAddress: event.ipAddress ?? null,
      },
    })
  }
}

import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs'
import { TenantContextService } from '../tenant/tenant-context.service'
import { TenantPrismaFactory } from '../database/tenant-prisma.factory'
import { ROLE_PERMISSIONS } from '../common/constants/permissions.constants'
import type { CreateApiKeyDto } from './dto/api-key.dto'

const PREFIX_LEN = 8
const KEY_BYTES = 32

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly tenantFactory: TenantPrismaFactory,
  ) {}

  private get db() { return this.tenantContext.getDb() }

  findAll(userId: string) {
    return this.db.apiKey.findMany({
      where: { userId, revokedAt: null },
      select: {
        id: true, name: true, prefix: true, scopes: true,
        lastUsedAt: true, expiresAt: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(userId: string, dto: CreateApiKeyDto): Promise<{ key: string; id: string; prefix: string }> {
    const rawKey = crypto.randomBytes(KEY_BYTES).toString('hex')
    const prefix = rawKey.substring(0, PREFIX_LEN)
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex')

    const record = await this.db.apiKey.create({
      data: {
        userId,
        name: dto.name,
        keyHash,
        prefix,
        scopes: (dto.scopes ?? []) as any,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
      select: { id: true, prefix: true },
    })

    // Return the full key ONCE — never stored in plain text
    return { key: `oa_${rawKey}`, id: record.id, prefix }
  }

  async revoke(id: string, userId: string): Promise<void> {
    const key = await this.db.apiKey.findUnique({ where: { id } })
    if (!key) throw new NotFoundException(`API key not found`)
    if (key.userId !== userId) throw new ForbiddenException('Not your API key')
    await this.db.apiKey.update({ where: { id }, data: { revokedAt: new Date() } })
  }

  // Called by ApiKeyStrategy — tenant-agnostic lookup by hash across factory
  async validateKey(rawKey: string, tenantSlug: string): Promise<{
    id: string; email: string; name: string; tenantSlug: string;
    role: string; permissions: string[]; requiresPasswordChange: boolean;
  }> {
    if (!rawKey.startsWith('oa_')) throw new UnauthorizedException('Invalid API key format')
    const stripped = rawKey.slice(3)
    const keyHash = crypto.createHash('sha256').update(stripped).digest('hex')

    const db = this.tenantFactory.getClient(tenantSlug)
    const apiKey = await db.apiKey.findFirst({
      where: { keyHash, revokedAt: null },
      include: {
        user: {
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        },
      },
    })

    if (!apiKey) throw new UnauthorizedException('Invalid or revoked API key')
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) throw new UnauthorizedException('API key expired')

    // Update last used timestamp (fire-and-forget)
    db.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(() => {})

    const user = apiKey.user
    const rolePerms = user.role.rolePermissions
    const permissions: string[] = rolePerms.length > 0
      ? rolePerms.map((rp) => `${rp.permission.resource}:${rp.permission.action}`)
      : (ROLE_PERMISSIONS[user.role.name.toLowerCase().replace(/ /g, '_')] ?? []) as string[]

    // If key has scopes, intersect with role permissions
    const scopes = apiKey.scopes as string[]
    const effectivePermissions = scopes.length > 0
      ? permissions.filter((p) => scopes.includes(p))
      : permissions

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tenantSlug,
      role: user.role.name,
      permissions: effectivePermissions,
      requiresPasswordChange: false,
    }
  }
}

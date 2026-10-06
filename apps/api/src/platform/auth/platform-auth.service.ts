import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { PlatformPrismaService } from '../../database/platform-prisma.service'
import type { PlatformLoginDto } from '../dto/platform.dto'

const PLATFORM_TENANT_SLUG = 'platform'

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['tenants:manage', 'tenants:view', 'audit:view', 'audit:export', 'settings:manage'],
  admin: ['tenants:manage', 'tenants:view', 'audit:view', 'settings:manage'],
  support_admin: ['tenants:view', 'audit:view'],
  billing_admin: ['tenants:view'],
  read_only: ['tenants:view'],
}

@Injectable()
export class PlatformAuthService {
  private readonly logger = new Logger(PlatformAuthService.name)

  constructor(
    private readonly platformDb: PlatformPrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: PlatformLoginDto, ipAddress: string, userAgent: string) {
    const user = await this.platformDb.platformUser.findUnique({
      where: { email: dto.email },
    })

    if (!user) {
      await bcrypt.hash('dummy', 12) // timing-safe
      throw new UnauthorizedException('Invalid email or password')
    }

    if (!user.active) {
      throw new UnauthorizedException('Account is disabled')
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const permissions = ROLE_PERMISSIONS[user.role.toLowerCase()] ?? []

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        tenantSlug: PLATFORM_TENANT_SLUG,
        role: user.role.toLowerCase(),
        permissions,
      },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRY', '15m'),
      },
    )

    this.logger.log(`Platform login: ${user.email} (${user.role}) from ${ipAddress}`)

    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }
  }

  async createPlatformAdmin(email: string, name: string, role = 'SUPER_ADMIN') {
    const existing = await this.platformDb.platformUser.findUnique({ where: { email } })
    if (existing) return existing

    const tempPassword = this.generateTempPassword()
    const passwordHash = await bcrypt.hash(tempPassword, 12)

    const user = await this.platformDb.platformUser.create({
      data: {
        email,
        name,
        passwordHash,
        role: role as any,
        active: true,
      },
    })

    this.logger.log(`Platform admin created: ${email} — temp password: ${tempPassword}`)
    return { ...user, tempPassword }
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!'
    return Array.from(crypto.randomBytes(12))
      .map((b) => chars[b % chars.length])
      .join('')
  }
}

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { PlatformPrismaService } from '../database/platform-prisma.service'
import { TenantPrismaFactory } from '../database/tenant-prisma.factory'
import { AccountLockoutService } from './account-lockout.service'
import { ROLE_PERMISSIONS } from '../common/constants/permissions.constants'
import type { JwtPayload } from '../common/interfaces/request-user.interface'
import type { LoginDto } from './dto/login.dto'
import type { RequestPasswordResetDto, ConfirmPasswordResetDto } from './dto/reset-password.dto'
import type { ForceChangePasswordDto } from './dto/force-change.dto'

const REFRESH_TOKEN_EXPIRY_DAYS = 7
const MFA_TOKEN_EXPIRY_MINUTES = 5

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly bcryptRounds: number

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly platformDb: PlatformPrismaService,
    private readonly tenantFactory: TenantPrismaFactory,
    private readonly lockout: AccountLockoutService,
  ) {
    this.bcryptRounds = parseInt(String(config.get('BCRYPT_ROUNDS', 12)), 10) || 12
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, ipAddress: string, userAgent: string) {
    const tenantSlug = dto.tenantSlug!
    const db = this.tenantFactory.getClient(tenantSlug)

    // 1. Check account lockout before any DB query (fail-fast)
    const lockStatus = await this.lockout.isLocked(tenantSlug, dto.email)
    if (lockStatus.locked) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_LOCKED',
        message: 'Account temporarily locked due to too many failed login attempts.',
        lockedUntil: lockStatus.lockedUntil,
      })
    }

    const user = await db.user.findUnique({
      where: { email: dto.email },
      include: {
        role: { include: { rolePermissions: { include: { permission: true } } } },
      },
    })

    if (!user || !user.passwordHash) {
      await this.simulateHashDelay()
      await this.lockout.recordFailedAttempt(tenantSlug, dto.email)
      throw new UnauthorizedException('Invalid email or password')
    }

    if (user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Account is disabled')
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) {
      const result = await this.lockout.recordFailedAttempt(tenantSlug, dto.email)
      throw new UnauthorizedException(
        result.locked
          ? { code: 'ACCOUNT_LOCKED', message: 'Account locked after too many failed attempts.', lockedUntil: result.lockedUntil }
          : { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', attemptsRemaining: result.attemptsRemaining },
      )
    }

    // 2. Clear lockout on success
    await this.lockout.recordSuccessfulLogin(tenantSlug, dto.email)

    // 3. MFA pending — issue short-lived scoped token
    if (user.mfaEnabled) {
      const mfaToken = await this.jwtService.signAsync(
        { sub: user.id, tenantSlug, mfaPending: true },
        { expiresIn: `${MFA_TOKEN_EXPIRY_MINUTES}m` },
      )
      return { mfaRequired: true, mfaToken }
    }

    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

    const permissions = this.extractPermissions(user.role.name, user.role.rolePermissions)
    const tokens = await this.issueTokens(
      { ...user, requiresPasswordChange: user.forcePasswordChange },
      tenantSlug, permissions, db, ipAddress, userAgent,
    )

    return {
      mfaRequired: false,
      requiresPasswordChange: user.forcePasswordChange,
      user: { id: user.id, email: user.email, name: user.name, role: user.role.name },
      ...tokens,
    }
  }

  // ─── Force Password Change ────────────────────────────────────────────────

  async forceChangePassword(userId: string, tenantSlug: string, dto: ForceChangePasswordDto) {
    const db = this.tenantFactory.getClient(tenantSlug)
    const user = await db.user.findUnique({ where: { id: userId } })

    if (!user) throw new UnauthorizedException('User not found')

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash ?? '')
    if (!valid) throw new UnauthorizedException('Current password is incorrect')

    const newHash = await bcrypt.hash(dto.newPassword, this.bcryptRounds)

    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { passwordHash: newHash, forcePasswordChange: false },
      }),
      // Revoke all existing sessions — new session will be issued on next login
      db.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ])

    return { message: 'Password changed successfully. Please log in again.' }
  }

  // ─── MFA Verify ───────────────────────────────────────────────────────────

  async verifyMfa(mfaToken: string, code: string, ipAddress: string, userAgent: string) {
    let payload: { sub: string; tenantSlug: string; mfaPending: boolean }
    try {
      payload = await this.jwtService.verifyAsync(mfaToken)
    } catch {
      throw new UnauthorizedException('MFA token expired or invalid')
    }
    if (!payload.mfaPending) throw new UnauthorizedException('Invalid MFA token')

    const db = this.tenantFactory.getClient(payload.tenantSlug)
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
    })
    if (!user || !user.mfaSecret) throw new UnauthorizedException('User not found')

    const { TOTP } = await import('otpauth')
    const totp = new TOTP({ secret: user.mfaSecret, digits: 6, period: 30 })
    if (totp.validate({ token: code, window: 1 }) === null) {
      await this.lockout.recordFailedAttempt(payload.tenantSlug, user.email)
      throw new UnauthorizedException('Invalid MFA code')
    }

    await this.lockout.recordSuccessfulLogin(payload.tenantSlug, user.email)
    const permissions = this.extractPermissions(user.role.name, user.role.rolePermissions)
    return this.issueTokens(user, payload.tenantSlug, permissions, db, ipAddress, userAgent)
  }

  // ─── Refresh ──────────────────────────────────────────────────────────────

  async refreshTokens(refreshToken: string, tenantSlug: string, ipAddress: string, userAgent: string) {
    const tokenHash = this.hashToken(refreshToken)
    const db = this.tenantFactory.getClient(tenantSlug)

    const session = await db.session.findFirst({
      where: { refreshTokenHash: tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } },
    })
    if (!session) throw new UnauthorizedException('Invalid or expired refresh token')

    await db.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } })

    const permissions = this.extractPermissions(session.user.role.name, session.user.role.rolePermissions)
    return this.issueTokens(session.user, tenantSlug, permissions, db, ipAddress, userAgent)
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(refreshToken: string, tenantSlug: string) {
    const tokenHash = this.hashToken(refreshToken)
    const db = this.tenantFactory.getClient(tenantSlug)
    await db.session.updateMany({ where: { refreshTokenHash: tokenHash, revokedAt: null }, data: { revokedAt: new Date() } })
  }

  async logoutAll(userId: string, tenantSlug: string) {
    const db = this.tenantFactory.getClient(tenantSlug)
    await db.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
  }

  // ─── Password Reset ───────────────────────────────────────────────────────

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const db = this.tenantFactory.getClient(dto.tenantSlug)
    const user = await db.user.findUnique({ where: { email: dto.email } })
    if (!user) return { message: 'If that email exists, a reset link was sent.' }

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = this.hashToken(token)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await db.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } })
    this.logger.log(`Password reset requested for ${user.email}`)
    return { message: 'If that email exists, a reset link was sent.' }
  }

  async confirmPasswordReset(dto: ConfirmPasswordResetDto, tenantSlug: string) {
    const tokenHash = this.hashToken(dto.token)
    const db = this.tenantFactory.getClient(tenantSlug)

    const record = await db.passwordResetToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    })
    if (!record) throw new BadRequestException('Reset token is invalid or has expired')

    const passwordHash = await bcrypt.hash(dto.newPassword, this.bcryptRounds)

    await db.$transaction([
      db.user.update({ where: { id: record.userId }, data: { passwordHash, forcePasswordChange: false } }),
      db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      db.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    ])

    return { message: 'Password reset successfully' }
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private async issueTokens(
    user: { id: string; email: string; name: string; requiresPasswordChange?: boolean; role: { name: string } },
    tenantSlug: string,
    permissions: string[],
    db: ReturnType<TenantPrismaFactory['getClient']>,
    ipAddress: string,
    userAgent: string,
  ) {
    const payload: JwtPayload & { requiresPasswordChange?: boolean } = {
      sub: user.id,
      email: user.email,
      name: user.name,
      tenantSlug,
      role: user.role.name,
      permissions,
      requiresPasswordChange: user.requiresPasswordChange ?? false,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRY', '15m'),
      }),
      crypto.randomBytes(40).toString('hex'),
    ])

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

    await db.session.create({
      data: { userId: user.id, refreshTokenHash: this.hashToken(refreshToken), ipAddress, userAgent, expiresAt },
    })

    return { accessToken, refreshToken }
  }

  private extractPermissions(roleName: string, rolePermissions: Array<{ permission: { resource: string; action: string } }>): string[] {
    if (rolePermissions.length > 0) return rolePermissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`)
    const normalizedRole = roleName.toLowerCase().replace(/ /g, '_')
    return (ROLE_PERMISSIONS[normalizedRole] ?? []) as string[]
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  private async simulateHashDelay(): Promise<void> {
    await bcrypt.hash('dummy', 12)
  }

  // ─── MFA Enroll ───────────────────────────────────────────────────────────

  async mfaEnroll(userId: string, tenantSlug: string): Promise<{ qrCodeUrl: string; secret: string }> {
    const db = this.tenantFactory.getClient(tenantSlug)
    const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, mfaEnabled: true } })

    if (user.mfaEnabled) throw new BadRequestException('MFA is already enabled')

    const { TOTP, Secret } = await import('otpauth')
    const secret = new Secret()
    const totp = new TOTP({
      issuer: 'OpsAura',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    })

    // Store pending secret (not yet active — requires confirm step)
    await db.user.update({ where: { id: userId }, data: { mfaSecret: secret.base32 } })

    const QRCode = await import('qrcode')
    const qrCodeUrl = await QRCode.toDataURL(totp.toString())
    return { qrCodeUrl, secret: secret.base32 }
  }

  async mfaEnable(userId: string, tenantSlug: string, code: string): Promise<{ backupCodes: string[] }> {
    const db = this.tenantFactory.getClient(tenantSlug)
    const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { mfaSecret: true, mfaEnabled: true } })

    if (user.mfaEnabled) throw new BadRequestException('MFA is already enabled')
    if (!user.mfaSecret) throw new BadRequestException('Start MFA enrollment first')

    const { TOTP } = await import('otpauth')
    const totp = new TOTP({ secret: user.mfaSecret, digits: 6, period: 30 })
    if (totp.validate({ token: code, window: 1 }) === null) {
      throw new UnauthorizedException('Invalid TOTP code')
    }

    await db.user.update({ where: { id: userId }, data: { mfaEnabled: true } })

    // Generate 8 single-use backup codes
    const backupCodes = Array.from({ length: 8 }, () => crypto.randomBytes(5).toString('hex'))
    this.logger.log(`MFA enabled for user ${userId}`)
    return { backupCodes }
  }

  async mfaDisable(userId: string, tenantSlug: string, code: string): Promise<void> {
    const db = this.tenantFactory.getClient(tenantSlug)
    const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { mfaSecret: true, mfaEnabled: true } })

    if (!user.mfaEnabled) throw new BadRequestException('MFA is not enabled')

    const { TOTP } = await import('otpauth')
    const totp = new TOTP({ secret: user.mfaSecret!, digits: 6, period: 30 })
    if (totp.validate({ token: code, window: 1 }) === null) {
      throw new UnauthorizedException('Invalid TOTP code')
    }

    await db.user.update({ where: { id: userId }, data: { mfaEnabled: false, mfaSecret: null } })
    this.logger.log(`MFA disabled for user ${userId}`)
  }

  async mfaStatus(userId: string, tenantSlug: string): Promise<{ enabled: boolean }> {
    const db = this.tenantFactory.getClient(tenantSlug)
    const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { mfaEnabled: true } })
    return { enabled: user.mfaEnabled }
  }
}

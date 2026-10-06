"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const platform_prisma_service_1 = require("../database/platform-prisma.service");
const tenant_prisma_factory_1 = require("../database/tenant-prisma.factory");
const account_lockout_service_1 = require("./account-lockout.service");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const MFA_TOKEN_EXPIRY_MINUTES = 5;
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService, config, platformDb, tenantFactory, lockout) {
        this.jwtService = jwtService;
        this.config = config;
        this.platformDb = platformDb;
        this.tenantFactory = tenantFactory;
        this.lockout = lockout;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.bcryptRounds = parseInt(String(config.get('BCRYPT_ROUNDS', 12)), 10) || 12;
    }
    async login(dto, ipAddress, userAgent) {
        const tenantSlug = dto.tenantSlug;
        const db = this.tenantFactory.getClient(tenantSlug);
        const lockStatus = await this.lockout.isLocked(tenantSlug, dto.email);
        if (lockStatus.locked) {
            throw new common_1.UnauthorizedException({
                code: 'ACCOUNT_LOCKED',
                message: 'Account temporarily locked due to too many failed login attempts.',
                lockedUntil: lockStatus.lockedUntil,
            });
        }
        const user = await db.user.findUnique({
            where: { email: dto.email },
            include: {
                role: { include: { rolePermissions: { include: { permission: true } } } },
            },
        });
        if (!user || !user.passwordHash) {
            await this.simulateHashDelay();
            await this.lockout.recordFailedAttempt(tenantSlug, dto.email);
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            const result = await this.lockout.recordFailedAttempt(tenantSlug, dto.email);
            throw new common_1.UnauthorizedException(result.locked
                ? { code: 'ACCOUNT_LOCKED', message: 'Account locked after too many failed attempts.', lockedUntil: result.lockedUntil }
                : { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', attemptsRemaining: result.attemptsRemaining });
        }
        await this.lockout.recordSuccessfulLogin(tenantSlug, dto.email);
        if (user.mfaEnabled) {
            const mfaToken = await this.jwtService.signAsync({ sub: user.id, tenantSlug, mfaPending: true }, { expiresIn: `${MFA_TOKEN_EXPIRY_MINUTES}m` });
            return { mfaRequired: true, mfaToken };
        }
        await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        const permissions = this.extractPermissions(user.role.name, user.role.rolePermissions);
        const tokens = await this.issueTokens({ ...user, requiresPasswordChange: user.forcePasswordChange }, tenantSlug, permissions, db, ipAddress, userAgent);
        return {
            mfaRequired: false,
            requiresPasswordChange: user.forcePasswordChange,
            user: { id: user.id, email: user.email, name: user.name, role: user.role.name },
            ...tokens,
        };
    }
    async forceChangePassword(userId, tenantSlug, dto) {
        const db = this.tenantFactory.getClient(tenantSlug);
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash ?? '');
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const newHash = await bcrypt.hash(dto.newPassword, this.bcryptRounds);
        await db.$transaction([
            db.user.update({
                where: { id: userId },
                data: { passwordHash: newHash, forcePasswordChange: false },
            }),
            db.session.updateMany({
                where: { userId, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        return { message: 'Password changed successfully. Please log in again.' };
    }
    async verifyMfa(mfaToken, code, ipAddress, userAgent) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(mfaToken);
        }
        catch {
            throw new common_1.UnauthorizedException('MFA token expired or invalid');
        }
        if (!payload.mfaPending)
            throw new common_1.UnauthorizedException('Invalid MFA token');
        const db = this.tenantFactory.getClient(payload.tenantSlug);
        const user = await db.user.findUnique({
            where: { id: payload.sub },
            include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        });
        if (!user || !user.mfaSecret)
            throw new common_1.UnauthorizedException('User not found');
        const { TOTP } = await Promise.resolve().then(() => require('otpauth'));
        const totp = new TOTP({ secret: user.mfaSecret, digits: 6, period: 30 });
        if (totp.validate({ token: code, window: 1 }) === null) {
            await this.lockout.recordFailedAttempt(payload.tenantSlug, user.email);
            throw new common_1.UnauthorizedException('Invalid MFA code');
        }
        await this.lockout.recordSuccessfulLogin(payload.tenantSlug, user.email);
        const permissions = this.extractPermissions(user.role.name, user.role.rolePermissions);
        return this.issueTokens(user, payload.tenantSlug, permissions, db, ipAddress, userAgent);
    }
    async refreshTokens(refreshToken, tenantSlug, ipAddress, userAgent) {
        const tokenHash = this.hashToken(refreshToken);
        const db = this.tenantFactory.getClient(tenantSlug);
        const session = await db.session.findFirst({
            where: { refreshTokenHash: tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
            include: { user: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } },
        });
        if (!session)
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        await db.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
        const permissions = this.extractPermissions(session.user.role.name, session.user.role.rolePermissions);
        return this.issueTokens(session.user, tenantSlug, permissions, db, ipAddress, userAgent);
    }
    async logout(refreshToken, tenantSlug) {
        const tokenHash = this.hashToken(refreshToken);
        const db = this.tenantFactory.getClient(tenantSlug);
        await db.session.updateMany({ where: { refreshTokenHash: tokenHash, revokedAt: null }, data: { revokedAt: new Date() } });
    }
    async logoutAll(userId, tenantSlug) {
        const db = this.tenantFactory.getClient(tenantSlug);
        await db.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    }
    async requestPasswordReset(dto) {
        const db = this.tenantFactory.getClient(dto.tenantSlug);
        const user = await db.user.findUnique({ where: { email: dto.email } });
        if (!user)
            return { message: 'If that email exists, a reset link was sent.' };
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await db.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
        this.logger.log(`Password reset requested for ${user.email}`);
        return { message: 'If that email exists, a reset link was sent.' };
    }
    async confirmPasswordReset(dto, tenantSlug) {
        const tokenHash = this.hashToken(dto.token);
        const db = this.tenantFactory.getClient(tenantSlug);
        const record = await db.passwordResetToken.findFirst({
            where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
        });
        if (!record)
            throw new common_1.BadRequestException('Reset token is invalid or has expired');
        const passwordHash = await bcrypt.hash(dto.newPassword, this.bcryptRounds);
        await db.$transaction([
            db.user.update({ where: { id: record.userId }, data: { passwordHash, forcePasswordChange: false } }),
            db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
            db.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
        ]);
        return { message: 'Password reset successfully' };
    }
    async issueTokens(user, tenantSlug, permissions, db, ipAddress, userAgent) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            tenantSlug,
            role: user.role.name,
            permissions,
            requiresPasswordChange: user.requiresPasswordChange ?? false,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_ACCESS_SECRET'),
                expiresIn: this.config.get('JWT_ACCESS_EXPIRY', '15m'),
            }),
            crypto.randomBytes(40).toString('hex'),
        ]);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
        await db.session.create({
            data: { userId: user.id, refreshTokenHash: this.hashToken(refreshToken), ipAddress, userAgent, expiresAt },
        });
        return { accessToken, refreshToken };
    }
    extractPermissions(roleName, rolePermissions) {
        if (rolePermissions.length > 0)
            return rolePermissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`);
        const normalizedRole = roleName.toLowerCase().replace(/ /g, '_');
        return (permissions_constants_1.ROLE_PERMISSIONS[normalizedRole] ?? []);
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async simulateHashDelay() {
        await bcrypt.hash('dummy', 12);
    }
    async mfaEnroll(userId, tenantSlug) {
        const db = this.tenantFactory.getClient(tenantSlug);
        const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, mfaEnabled: true } });
        if (user.mfaEnabled)
            throw new common_1.BadRequestException('MFA is already enabled');
        const { TOTP, Secret } = await Promise.resolve().then(() => require('otpauth'));
        const secret = new Secret();
        const totp = new TOTP({
            issuer: 'OpsAura',
            label: user.email,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret,
        });
        await db.user.update({ where: { id: userId }, data: { mfaSecret: secret.base32 } });
        const QRCode = await Promise.resolve().then(() => require('qrcode'));
        const qrCodeUrl = await QRCode.toDataURL(totp.toString());
        return { qrCodeUrl, secret: secret.base32 };
    }
    async mfaEnable(userId, tenantSlug, code) {
        const db = this.tenantFactory.getClient(tenantSlug);
        const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { mfaSecret: true, mfaEnabled: true } });
        if (user.mfaEnabled)
            throw new common_1.BadRequestException('MFA is already enabled');
        if (!user.mfaSecret)
            throw new common_1.BadRequestException('Start MFA enrollment first');
        const { TOTP } = await Promise.resolve().then(() => require('otpauth'));
        const totp = new TOTP({ secret: user.mfaSecret, digits: 6, period: 30 });
        if (totp.validate({ token: code, window: 1 }) === null) {
            throw new common_1.UnauthorizedException('Invalid TOTP code');
        }
        await db.user.update({ where: { id: userId }, data: { mfaEnabled: true } });
        const backupCodes = Array.from({ length: 8 }, () => crypto.randomBytes(5).toString('hex'));
        this.logger.log(`MFA enabled for user ${userId}`);
        return { backupCodes };
    }
    async mfaDisable(userId, tenantSlug, code) {
        const db = this.tenantFactory.getClient(tenantSlug);
        const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { mfaSecret: true, mfaEnabled: true } });
        if (!user.mfaEnabled)
            throw new common_1.BadRequestException('MFA is not enabled');
        const { TOTP } = await Promise.resolve().then(() => require('otpauth'));
        const totp = new TOTP({ secret: user.mfaSecret, digits: 6, period: 30 });
        if (totp.validate({ token: code, window: 1 }) === null) {
            throw new common_1.UnauthorizedException('Invalid TOTP code');
        }
        await db.user.update({ where: { id: userId }, data: { mfaEnabled: false, mfaSecret: null } });
        this.logger.log(`MFA disabled for user ${userId}`);
    }
    async mfaStatus(userId, tenantSlug) {
        const db = this.tenantFactory.getClient(tenantSlug);
        const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { mfaEnabled: true } });
        return { enabled: user.mfaEnabled };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        platform_prisma_service_1.PlatformPrismaService,
        tenant_prisma_factory_1.TenantPrismaFactory,
        account_lockout_service_1.AccountLockoutService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
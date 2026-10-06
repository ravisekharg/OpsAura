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
var PlatformAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
const PLATFORM_TENANT_SLUG = 'platform';
const ROLE_PERMISSIONS = {
    super_admin: ['tenants:manage', 'tenants:view', 'audit:view', 'audit:export', 'settings:manage'],
    admin: ['tenants:manage', 'tenants:view', 'audit:view', 'settings:manage'],
    support_admin: ['tenants:view', 'audit:view'],
    billing_admin: ['tenants:view'],
    read_only: ['tenants:view'],
};
let PlatformAuthService = PlatformAuthService_1 = class PlatformAuthService {
    constructor(platformDb, jwtService, config) {
        this.platformDb = platformDb;
        this.jwtService = jwtService;
        this.config = config;
        this.logger = new common_1.Logger(PlatformAuthService_1.name);
    }
    async login(dto, ipAddress, userAgent) {
        const user = await this.platformDb.platformUser.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            await bcrypt.hash('dummy', 12);
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.active) {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const permissions = ROLE_PERMISSIONS[user.role.toLowerCase()] ?? [];
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            name: user.name,
            tenantSlug: PLATFORM_TENANT_SLUG,
            role: user.role.toLowerCase(),
            permissions,
        }, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRY', '15m'),
        });
        this.logger.log(`Platform login: ${user.email} (${user.role}) from ${ipAddress}`);
        return {
            accessToken,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }
    async createPlatformAdmin(email, name, role = 'SUPER_ADMIN') {
        const existing = await this.platformDb.platformUser.findUnique({ where: { email } });
        if (existing)
            return existing;
        const tempPassword = this.generateTempPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 12);
        const user = await this.platformDb.platformUser.create({
            data: {
                email,
                name,
                passwordHash,
                role: role,
                active: true,
            },
        });
        this.logger.log(`Platform admin created: ${email} — temp password: ${tempPassword}`);
        return { ...user, tempPassword };
    }
    generateTempPassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!';
        return Array.from(crypto.randomBytes(12))
            .map((b) => chars[b % chars.length])
            .join('');
    }
};
exports.PlatformAuthService = PlatformAuthService;
exports.PlatformAuthService = PlatformAuthService = PlatformAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], PlatformAuthService);
//# sourceMappingURL=platform-auth.service.js.map
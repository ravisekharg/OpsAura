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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const tenant_prisma_factory_1 = require("../database/tenant-prisma.factory");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const PREFIX_LEN = 8;
const KEY_BYTES = 32;
let ApiKeysService = class ApiKeysService {
    constructor(tenantContext, tenantFactory) {
        this.tenantContext = tenantContext;
        this.tenantFactory = tenantFactory;
    }
    get db() { return this.tenantContext.getDb(); }
    findAll(userId) {
        return this.db.apiKey.findMany({
            where: { userId, revokedAt: null },
            select: {
                id: true, name: true, prefix: true, scopes: true,
                lastUsedAt: true, expiresAt: true, createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(userId, dto) {
        const rawKey = crypto.randomBytes(KEY_BYTES).toString('hex');
        const prefix = rawKey.substring(0, PREFIX_LEN);
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
        const record = await this.db.apiKey.create({
            data: {
                userId,
                name: dto.name,
                keyHash,
                prefix,
                scopes: (dto.scopes ?? []),
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
            },
            select: { id: true, prefix: true },
        });
        return { key: `oa_${rawKey}`, id: record.id, prefix };
    }
    async revoke(id, userId) {
        const key = await this.db.apiKey.findUnique({ where: { id } });
        if (!key)
            throw new common_1.NotFoundException(`API key not found`);
        if (key.userId !== userId)
            throw new common_1.ForbiddenException('Not your API key');
        await this.db.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
    }
    async validateKey(rawKey, tenantSlug) {
        if (!rawKey.startsWith('oa_'))
            throw new common_1.UnauthorizedException('Invalid API key format');
        const stripped = rawKey.slice(3);
        const keyHash = crypto.createHash('sha256').update(stripped).digest('hex');
        const db = this.tenantFactory.getClient(tenantSlug);
        const apiKey = await db.apiKey.findFirst({
            where: { keyHash, revokedAt: null },
            include: {
                user: {
                    include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
                },
            },
        });
        if (!apiKey)
            throw new common_1.UnauthorizedException('Invalid or revoked API key');
        if (apiKey.expiresAt && apiKey.expiresAt < new Date())
            throw new common_1.UnauthorizedException('API key expired');
        db.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(() => { });
        const user = apiKey.user;
        const rolePerms = user.role.rolePermissions;
        const permissions = rolePerms.length > 0
            ? rolePerms.map((rp) => `${rp.permission.resource}:${rp.permission.action}`)
            : (permissions_constants_1.ROLE_PERMISSIONS[user.role.name.toLowerCase().replace(/ /g, '_')] ?? []);
        const scopes = apiKey.scopes;
        const effectivePermissions = scopes.length > 0
            ? permissions.filter((p) => scopes.includes(p))
            : permissions;
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            tenantSlug,
            role: user.role.name,
            permissions: effectivePermissions,
            requiresPasswordChange: false,
        };
    }
};
exports.ApiKeysService = ApiKeysService;
exports.ApiKeysService = ApiKeysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService,
        tenant_prisma_factory_1.TenantPrismaFactory])
], ApiKeysService);
//# sourceMappingURL=api-keys.service.js.map
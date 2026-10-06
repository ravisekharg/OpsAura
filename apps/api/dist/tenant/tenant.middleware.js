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
var TenantMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const tenant_context_service_1 = require("./tenant-context.service");
const tenant_prisma_factory_1 = require("../database/tenant-prisma.factory");
const platform_prisma_service_1 = require("../database/platform-prisma.service");
let TenantMiddleware = TenantMiddleware_1 = class TenantMiddleware {
    constructor(tenantContext, tenantFactory, platformDb) {
        this.tenantContext = tenantContext;
        this.tenantFactory = tenantFactory;
        this.platformDb = platformDb;
        this.logger = new common_1.Logger(TenantMiddleware_1.name);
    }
    async use(req, _res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        let tenantSlug;
        try {
            const decoded = jwt.decode(token);
            tenantSlug = decoded?.tenantSlug;
        }
        catch {
            return next();
        }
        if (!tenantSlug) {
            return next();
        }
        if (tenantSlug === 'platform') {
            return next();
        }
        const tenant = await this.platformDb.tenant.findUnique({
            where: { slug: tenantSlug },
            select: { status: true, slug: true },
        });
        if (!tenant) {
            throw new common_1.UnauthorizedException('Tenant not found');
        }
        if (tenant.status === 'SUSPENDED' || tenant.status === 'CANCELLED') {
            throw new common_1.UnauthorizedException(`Tenant account is ${tenant.status.toLowerCase()}`);
        }
        const db = this.tenantFactory.getClient(tenantSlug);
        this.tenantContext.run({ tenantSlug, db }, () => next());
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = TenantMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService,
        tenant_prisma_factory_1.TenantPrismaFactory,
        platform_prisma_service_1.PlatformPrismaService])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map
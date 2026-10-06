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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const platform_guard_1 = require("../guards/platform.guard");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
let BillingController = class BillingController {
    constructor(platformDb) {
        this.platformDb = platformDb;
    }
    async overview() {
        const [tenants, subscriptions, plans] = await Promise.all([
            this.platformDb.tenant.count({ where: { status: 'ACTIVE' } }),
            this.platformDb.subscription.groupBy({
                by: ['status'],
                _count: { _all: true },
            }),
            this.platformDb.plan.findMany({
                include: { _count: { select: { tenants: true } } },
            }),
        ]);
        const activeSubscriptions = subscriptions.find((s) => s.status === 'ACTIVE')?._count._all ?? 0;
        const trialingSubscriptions = subscriptions.find((s) => s.status === 'TRIALING')?._count._all ?? 0;
        const activeSubs = await this.platformDb.subscription.findMany({
            where: { status: { in: ['ACTIVE', 'TRIALING'] } },
            include: { plan: { select: { priceMonthly: true } } },
        });
        const mrr = activeSubs.reduce((sum, s) => {
            const price = Number(s.plan.priceMonthly ?? 0);
            return sum + (s.billingCycle === 'ANNUAL' ? price : price);
        }, 0);
        return {
            activeTenants: tenants,
            activeSubscriptions,
            trialingSubscriptions,
            mrr,
            plans: plans.map((p) => ({
                id: p.id,
                name: p.name,
                tenantCount: p._count.tenants,
                priceMonthly: p.priceMonthly,
            })),
            subscriptionBreakdown: subscriptions.map((s) => ({
                status: s.status,
                count: s._count._all,
            })),
        };
    }
    async allSubscriptions(status) {
        return this.platformDb.subscription.findMany({
            where: status ? { status: status } : {},
            include: {
                tenant: { select: { id: true, slug: true, name: true } },
                plan: { select: { id: true, name: true, priceMonthly: true } },
            },
            orderBy: { startsAt: 'desc' },
        });
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Billing overview — active tenants, MRR, subscription statuses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'All subscriptions with tenant and plan detail' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "allSubscriptions", null);
exports.BillingController = BillingController = __decorate([
    (0, swagger_1.ApiTags)('Platform — Billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('platform/billing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, platform_guard_1.PlatformGuard),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map
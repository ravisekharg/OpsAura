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
var PlanLimitsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanLimitsService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const platform_prisma_service_1 = require("../database/platform-prisma.service");
let PlanLimitsService = PlanLimitsService_1 = class PlanLimitsService {
    constructor(tenantContext, platformDb) {
        this.tenantContext = tenantContext;
        this.platformDb = platformDb;
        this.logger = new common_1.Logger(PlanLimitsService_1.name);
    }
    async enforceLimit(resource, tenantSlug) {
        const tenant = await this.platformDb.tenant.findUnique({
            where: { slug: tenantSlug },
            include: { plan: true },
        });
        if (!tenant?.plan) {
            this.logger.warn(`No plan found for tenant ${tenantSlug} — skipping limit check`);
            return;
        }
        const limits = tenant.plan.limits;
        const limit = limits?.[resource];
        if (!limit || limit <= 0)
            return;
        const db = this.tenantContext.getDb();
        const current = await this.countResource(db, resource);
        if (current >= limit) {
            throw new common_1.ForbiddenException({
                code: 'PLAN_LIMIT_REACHED',
                message: `Your plan allows a maximum of ${limit} ${resource}. You have ${current}. Please upgrade your plan.`,
                resource,
                current,
                limit,
                upgradeUrl: 'https://opsaura.io/billing',
            });
        }
    }
    async countResource(db, resource) {
        switch (resource) {
            case 'users':
                return db.user.count({ where: { status: { in: ['ACTIVE', 'INVITED'] } } });
            case 'services':
                return db.service.count({ where: { status: 'ACTIVE' } });
            case 'schedules':
                return db.schedule.count({ where: { active: true } });
            case 'teams':
                return db.team.count();
            default:
                return 0;
        }
    }
};
exports.PlanLimitsService = PlanLimitsService;
exports.PlanLimitsService = PlanLimitsService = PlanLimitsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService,
        platform_prisma_service_1.PlatformPrismaService])
], PlanLimitsService);
//# sourceMappingURL=plan-limits.service.js.map
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
var TrialExpiryProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialExpiryProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const platform_prisma_service_1 = require("../database/platform-prisma.service");
const audit_service_1 = require("../audit/audit.service");
const TRIAL_DAYS = 14;
let TrialExpiryProcessor = TrialExpiryProcessor_1 = class TrialExpiryProcessor {
    constructor(platformDb, auditService) {
        this.platformDb = platformDb;
        this.auditService = auditService;
        this.logger = new common_1.Logger(TrialExpiryProcessor_1.name);
    }
    async checkExpiredTrials(_job) {
        const trialCutoff = new Date(Date.now() - TRIAL_DAYS * 24 * 60 * 60 * 1000);
        const expired = await this.platformDb.subscription.findMany({
            where: {
                status: 'TRIALING',
                startsAt: { lte: trialCutoff },
            },
            include: {
                tenant: { select: { id: true, slug: true, name: true } },
                plan: { select: { name: true } },
            },
        });
        if (expired.length === 0) {
            this.logger.debug('Trial expiry check: no expired trials');
            return;
        }
        this.logger.log(`Trial expiry: ${expired.length} subscription(s) to expire`);
        for (const sub of expired) {
            await this.platformDb.subscription.update({
                where: { id: sub.id },
                data: { status: 'PAST_DUE' },
            });
            await this.auditService.emit({
                category: 'tenant',
                action: 'TRIAL_EXPIRED',
                tenantSlug: 'platform',
                actorId: undefined,
                actorEmail: 'system@opsaura.io',
                target: sub.tenant.slug,
                detail: `Trial expired for tenant "${sub.tenant.name}" on plan "${sub.plan.name}"`,
                severity: 'WARNING',
            });
            this.logger.warn(`Trial expired: tenant=${sub.tenant.slug} plan=${sub.plan.name}`);
        }
    }
};
exports.TrialExpiryProcessor = TrialExpiryProcessor;
__decorate([
    (0, bull_1.Process)('check-trials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrialExpiryProcessor.prototype, "checkExpiredTrials", null);
exports.TrialExpiryProcessor = TrialExpiryProcessor = TrialExpiryProcessor_1 = __decorate([
    (0, bull_1.Processor)('trial-expiry'),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService,
        audit_service_1.AuditService])
], TrialExpiryProcessor);
//# sourceMappingURL=trial-expiry.processor.js.map
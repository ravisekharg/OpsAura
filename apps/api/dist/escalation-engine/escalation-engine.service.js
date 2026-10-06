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
var EscalationEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscalationEngineService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let EscalationEngineService = EscalationEngineService_1 = class EscalationEngineService {
    constructor(stepQueue, tenantContext) {
        this.stepQueue = stepQueue;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(EscalationEngineService_1.name);
    }
    get db() { return this.tenantContext.getDb(); }
    async startEscalation(escalationId, tenantSlug) {
        const db = this.tenantContext.getDb();
        const escalation = await db.escalation.findUnique({
            where: { id: escalationId },
            include: { policy: true },
        });
        if (!escalation?.policy) {
            this.logger.warn(`Escalation ${escalationId} has no policy — skipping escalation engine`);
            return;
        }
        const steps = escalation.policy.steps;
        if (!steps || steps.length === 0)
            return;
        const firstStep = steps[0];
        const delayMs = (firstStep.delayMinutes ?? 5) * 60 * 1000;
        await this.stepQueue.add('execute-step', { escalationId, tenantSlug, stepOrder: 1 }, { delay: delayMs, attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
        this.logger.log(`Escalation ${escalationId} step 1 queued — fires in ${firstStep.delayMinutes}m`);
    }
    async acknowledgeEscalation(escalationId) {
        const jobs = await this.stepQueue.getDelayed();
        for (const job of jobs) {
            if (job.data.escalationId === escalationId) {
                await job.remove();
                this.logger.log(`Removed escalation step job for ${escalationId} (ACKed)`);
            }
        }
    }
    async resolveEscalation(escalationId) {
        await this.acknowledgeEscalation(escalationId);
    }
    async executeStep(job) {
        const { escalationId, tenantSlug, stepOrder } = job;
        const db = this.tenantContext.getDb();
        const escalation = await db.escalation.findUnique({
            where: { id: escalationId },
            include: { policy: true },
        });
        if (!escalation)
            return;
        if (escalation.status === 'RESOLVED' || escalation.status === 'ACKNOWLEDGED') {
            this.logger.log(`Escalation ${escalationId} already ${escalation.status} — stopping chain`);
            return;
        }
        const steps = escalation.policy?.steps ?? [];
        const step = steps.find((s) => s.order === stepOrder);
        if (!step)
            return;
        await db.escalation.update({
            where: { id: escalationId },
            data: { currentStep: stepOrder, status: 'ESCALATED' },
        });
        this.logger.log(`Escalation ${escalationId} executing step ${stepOrder}: notify ${step.type} "${step.target}" via ${step.notifyChannels?.join(',')}`);
        const nextStep = steps.find((s) => s.order === stepOrder + 1);
        if (nextStep) {
            const delayMs = (nextStep.delayMinutes ?? 10) * 60 * 1000;
            await this.stepQueue.add('execute-step', { escalationId, tenantSlug, stepOrder: stepOrder + 1 }, { delay: delayMs, attempts: 3 });
        }
        else {
            this.logger.log(`Escalation ${escalationId} — all steps exhausted`);
        }
    }
};
exports.EscalationEngineService = EscalationEngineService;
exports.EscalationEngineService = EscalationEngineService = EscalationEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('escalation-steps')),
    __metadata("design:paramtypes", [Object, tenant_context_service_1.TenantContextService])
], EscalationEngineService);
//# sourceMappingURL=escalation-engine.service.js.map
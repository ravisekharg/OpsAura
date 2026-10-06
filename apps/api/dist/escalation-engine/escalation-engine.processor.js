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
var EscalationEngineProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscalationEngineProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const tenant_prisma_factory_1 = require("../database/tenant-prisma.factory");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const escalation_engine_service_1 = require("./escalation-engine.service");
let EscalationEngineProcessor = EscalationEngineProcessor_1 = class EscalationEngineProcessor {
    constructor(engine, tenantFactory, tenantContext) {
        this.engine = engine;
        this.tenantFactory = tenantFactory;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(EscalationEngineProcessor_1.name);
    }
    async handleStep(job) {
        const { tenantSlug } = job.data;
        const db = this.tenantFactory.getClient(tenantSlug);
        await this.tenantContext.run({ tenantSlug, db }, () => this.engine.executeStep(job.data));
    }
};
exports.EscalationEngineProcessor = EscalationEngineProcessor;
__decorate([
    (0, bull_1.Process)('execute-step'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EscalationEngineProcessor.prototype, "handleStep", null);
exports.EscalationEngineProcessor = EscalationEngineProcessor = EscalationEngineProcessor_1 = __decorate([
    (0, bull_1.Processor)('escalation-steps'),
    __metadata("design:paramtypes", [escalation_engine_service_1.EscalationEngineService,
        tenant_prisma_factory_1.TenantPrismaFactory,
        tenant_context_service_1.TenantContextService])
], EscalationEngineProcessor);
//# sourceMappingURL=escalation-engine.processor.js.map
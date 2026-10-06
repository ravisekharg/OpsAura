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
var AlertsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const alerts_repository_1 = require("./alerts.repository");
const dedup_service_1 = require("./dedup/dedup.service");
const suppression_service_1 = require("./suppression/suppression.service");
const correlation_service_1 = require("./correlation/correlation.service");
const routing_engine_service_1 = require("./routing/routing-engine.service");
const oncall_resolver_service_1 = require("./routing/oncall-resolver.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let AlertsService = AlertsService_1 = class AlertsService {
    constructor(repo, dedup, suppression, correlation, routingEngine, oncallResolver, tenantContext) {
        this.repo = repo;
        this.dedup = dedup;
        this.suppression = suppression;
        this.correlation = correlation;
        this.routingEngine = routingEngine;
        this.oncallResolver = oncallResolver;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(AlertsService_1.name);
    }
    async ingest(normalized) {
        this.logger.log(`Ingesting alert: "${normalized.title}" sev=${normalized.severity} src=${normalized.source}`);
        const serviceId = await this.resolveServiceId(normalized.serviceName);
        const { suppressed, reason } = await this.suppression.isSuppressed(normalized);
        if (suppressed) {
            this.logger.log(`Alert suppressed: ${reason}`);
            const alert = await this.repo.create({
                ...normalized,
                status: 'SUPPRESSED',
                severity: normalized.severity,
                serviceId,
            });
            return { alert, action: 'suppressed', assignmentGroup: null, onCall: { userId: null, userName: null, scheduleName: null, isOverride: false } };
        }
        const { isDuplicate, alert: existingAlert } = await this.dedup.checkDuplicate(normalized.fingerprint);
        if (isDuplicate && existingAlert) {
            return {
                alert: existingAlert,
                action: 'deduplicated',
                assignmentGroup: existingAlert.assignmentGroupId,
                onCall: { userId: null, userName: null, scheduleName: null, isOverride: false },
            };
        }
        const correlationGroupId = await this.correlation.resolveCorrelationGroup(normalized);
        const assignmentGroupId = await this.routingEngine.resolveAssignmentGroup(normalized);
        let onCallResult = { userId: null, userName: null, userEmail: null, scheduleName: null, isOverride: false, rotationName: null };
        if (assignmentGroupId) {
            onCallResult = await this.oncallResolver.resolveOnCall(assignmentGroupId);
        }
        const alert = await this.repo.create({
            title: normalized.title,
            description: normalized.description,
            severity: normalized.severity,
            status: 'FIRING',
            serviceId,
            source: normalized.source,
            assignmentGroupId: assignmentGroupId ?? undefined,
            assignedUserId: onCallResult.userId ?? undefined,
            tags: normalized.tags,
            fingerprint: normalized.fingerprint,
            correlationGroupId,
            rawPayload: normalized.rawPayload,
        });
        this.logger.log(`Alert created: id=${alert.id} group=${assignmentGroupId ?? 'none'} oncall=${onCallResult.userName ?? 'none'}`);
        return {
            alert,
            action: 'created',
            assignmentGroup: assignmentGroupId,
            onCall: {
                userId: onCallResult.userId,
                userName: onCallResult.userName,
                scheduleName: onCallResult.scheduleName,
                isOverride: onCallResult.isOverride,
            },
        };
    }
    async findAll(query) {
        const { items, total } = await this.repo.findMany(query);
        return (0, pagination_dto_1.paginate)(items, total, query.page ?? 1, query.limit ?? 50);
    }
    async findOne(id) {
        const alert = await this.repo.findById(id);
        if (!alert)
            throw new common_1.NotFoundException(`Alert ${id} not found`);
        return alert;
    }
    async acknowledge(id, userId) {
        await this.findOne(id);
        return this.repo.acknowledge(id, userId);
    }
    async resolve(id) {
        await this.findOne(id);
        return this.repo.resolve(id);
    }
    async suppress(id) {
        await this.findOne(id);
        return this.repo.suppress(id);
    }
    getSuppressionRules() {
        return this.repo.findSuppressionRules();
    }
    createSuppressionRule(data) {
        return this.repo.createSuppressionRule(data);
    }
    updateSuppressionRule(id, data) {
        return this.repo.updateSuppressionRule(id, data);
    }
    getCorrelationRules() {
        return this.repo.findCorrelationRules();
    }
    createCorrelationRule(data) {
        return this.repo.createCorrelationRule(data);
    }
    updateCorrelationRule(id, data) {
        return this.repo.updateCorrelationRule(id, data);
    }
    async resolveServiceId(serviceName) {
        if (!serviceName)
            return undefined;
        const db = this.tenantContext.getDb();
        const service = await db.service.findFirst({
            where: { name: { equals: serviceName, mode: 'insensitive' } },
        });
        return service?.id;
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = AlertsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [alerts_repository_1.AlertsRepository,
        dedup_service_1.DedupService,
        suppression_service_1.SuppressionService,
        correlation_service_1.CorrelationService,
        routing_engine_service_1.RoutingEngineService,
        oncall_resolver_service_1.OnCallResolverService,
        tenant_context_service_1.TenantContextService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map
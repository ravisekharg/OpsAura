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
var RoutingEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingEngineService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../../tenant/tenant-context.service");
let RoutingEngineService = RoutingEngineService_1 = class RoutingEngineService {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(RoutingEngineService_1.name);
    }
    get db() {
        return this.tenantContext.getDb();
    }
    async resolveAssignmentGroup(alert) {
        const rules = await this.db.routingRule.findMany({
            where: { active: true },
            orderBy: { priority: 'asc' },
        });
        for (const rule of rules) {
            const conditions = rule.conditions;
            if (!Array.isArray(conditions) || conditions.length === 0)
                continue;
            const allMatch = conditions.every((cond) => this.evaluateCondition(alert, cond));
            if (allMatch) {
                this.logger.debug(`Alert matched routing rule "${rule.name}" (priority=${rule.priority}) → group=${rule.assignmentGroupId}`);
                return rule.assignmentGroupId;
            }
        }
        const defaultGroupId = await this.getDefaultAssignmentGroupId();
        if (defaultGroupId) {
            this.logger.debug(`No routing rule matched. Using default group=${defaultGroupId}`);
            return defaultGroupId;
        }
        this.logger.warn('No routing rule matched and no default assignment group configured');
        return null;
    }
    evaluateCondition(alert, cond) {
        const field = cond.field?.toLowerCase();
        const operator = cond.operator?.toLowerCase();
        const expected = cond.value?.toLowerCase();
        const actual = this.extractFieldValue(alert, field);
        if (actual === null)
            return false;
        switch (operator) {
            case 'equals':
                return actual === expected;
            case 'contains':
                return actual.includes(expected);
            case 'starts_with':
                return actual.startsWith(expected);
            case 'in': {
                const list = expected.split(',').map((v) => v.trim());
                return list.includes(actual);
            }
            default:
                this.logger.warn(`Unknown routing condition operator: ${operator}`);
                return false;
        }
    }
    extractFieldValue(alert, field) {
        switch (field) {
            case 'service':
                return alert.serviceName?.toLowerCase() ?? null;
            case 'severity':
                return alert.severity.toLowerCase();
            case 'source':
                return alert.source.toLowerCase();
            case 'tag':
                return alert.tags[0]?.toLowerCase() ?? null;
            case 'region':
                return (alert.tags
                    .find((t) => t.toLowerCase().startsWith('region:'))
                    ?.split(':')[1]
                    ?.toLowerCase() ?? null);
            default:
                return null;
        }
    }
    async getDefaultAssignmentGroupId() {
        const setting = await this.db.setting.findUnique({
            where: { key: 'alerts.defaultAssignmentGroupId' },
        });
        if (!setting)
            return null;
        const value = setting.value;
        return value?.groupId ?? null;
    }
};
exports.RoutingEngineService = RoutingEngineService;
exports.RoutingEngineService = RoutingEngineService = RoutingEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], RoutingEngineService);
//# sourceMappingURL=routing-engine.service.js.map
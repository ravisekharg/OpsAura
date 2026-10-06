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
exports.RoutingRulesService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const RULE_INCLUDE = {
    assignmentGroup: { select: { id: true, name: true } },
};
let RoutingRulesService = class RoutingRulesService {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
    }
    get db() { return this.tenantContext.getDb(); }
    findAll(assignmentGroupId) {
        return this.db.routingRule.findMany({
            where: assignmentGroupId ? { assignmentGroupId } : {},
            include: RULE_INCLUDE,
            orderBy: { priority: 'asc' },
        });
    }
    async findOne(id) {
        const rule = await this.db.routingRule.findUnique({ where: { id }, include: RULE_INCLUDE });
        if (!rule)
            throw new common_1.NotFoundException(`Routing rule ${id} not found`);
        return rule;
    }
    async create(dto) {
        const conflict = await this.db.routingRule.findFirst({
            where: { priority: dto.priority, active: true },
        });
        if (conflict)
            throw new common_1.ConflictException(`Priority ${dto.priority} is already in use by rule "${conflict.name}"`);
        return this.db.routingRule.create({
            data: {
                name: dto.name,
                priority: dto.priority,
                conditions: dto.conditions,
                assignmentGroupId: dto.assignmentGroupId,
                active: dto.active ?? true,
            },
            include: RULE_INCLUDE,
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.priority) {
            const conflict = await this.db.routingRule.findFirst({
                where: { priority: dto.priority, active: true, NOT: { id } },
            });
            if (conflict)
                throw new common_1.ConflictException(`Priority ${dto.priority} is already in use`);
        }
        return this.db.routingRule.update({ where: { id }, data: dto, include: RULE_INCLUDE });
    }
    async remove(id) {
        await this.findOne(id);
        return this.db.routingRule.delete({ where: { id } });
    }
    async reorder(dto) {
        await this.db.$transaction(dto.rules.map(({ id, priority }) => this.db.routingRule.update({ where: { id }, data: { priority } })));
        return this.findAll();
    }
    async testRule(alertPayload) {
        const rules = await this.db.routingRule.findMany({
            where: { active: true },
            include: RULE_INCLUDE,
            orderBy: { priority: 'asc' },
        });
        for (const rule of rules) {
            const conditions = rule.conditions;
            const matched = conditions.every((c) => this.evalCondition(c, alertPayload));
            if (matched) {
                return { matched: true, rule, assignmentGroup: rule.assignmentGroup };
            }
        }
        return { matched: false, rule: null, assignmentGroup: null };
    }
    evalCondition(condition, payload) {
        const fieldValue = String(payload[condition.field] ?? '');
        const val = condition.value;
        switch (condition.operator) {
            case 'equals': return fieldValue === val;
            case 'contains': return fieldValue.includes(val);
            case 'starts_with': return fieldValue.startsWith(val);
            case 'ends_with': return fieldValue.endsWith(val);
            case 'matches_regex': return new RegExp(val).test(fieldValue);
            case 'in': return Array.isArray(val) && val.includes(fieldValue);
            default: return false;
        }
    }
};
exports.RoutingRulesService = RoutingRulesService;
exports.RoutingRulesService = RoutingRulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], RoutingRulesService);
//# sourceMappingURL=routing-rules.service.js.map
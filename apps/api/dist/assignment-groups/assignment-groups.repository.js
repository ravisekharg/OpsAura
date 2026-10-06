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
exports.AssignmentGroupsRepository = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let AssignmentGroupsRepository = class AssignmentGroupsRepository {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
        this.groupInclude = {
            team: { select: { id: true, name: true } },
            escalationPolicy: { select: { id: true, name: true } },
            _count: { select: { serviceOwnerships: true, routingRules: true } },
        };
    }
    get db() {
        return this.tenantContext.getDb();
    }
    async findGroups(search) {
        const where = search
            ? { name: { contains: search, mode: 'insensitive' } }
            : {};
        return this.db.assignmentGroup.findMany({
            where,
            include: this.groupInclude,
            orderBy: { name: 'asc' },
        });
    }
    async findGroupById(id) {
        return this.db.assignmentGroup.findUnique({
            where: { id },
            include: this.groupInclude,
        });
    }
    async createGroup(data) {
        return this.db.assignmentGroup.create({
            data: {
                name: data.name,
                description: data.description,
                teamId: data.teamId ?? null,
                oncallPolicy: data.oncallPolicy,
                escalationPolicyId: data.escalationPolicyId ?? null,
                active: data.active ?? true,
            },
            include: this.groupInclude,
        });
    }
    async updateGroup(id, data) {
        return this.db.assignmentGroup.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                teamId: data.teamId,
                oncallPolicy: data.oncallPolicy,
                escalationPolicyId: data.escalationPolicyId,
                active: data.active,
            },
            include: this.groupInclude,
        });
    }
    async deleteGroup(id) {
        return this.db.assignmentGroup.delete({ where: { id } });
    }
    async findRules() {
        return this.db.routingRule.findMany({
            include: {
                assignmentGroup: { select: { id: true, name: true } },
            },
            orderBy: { priority: 'asc' },
        });
    }
    async findRuleById(id) {
        return this.db.routingRule.findUnique({
            where: { id },
            include: { assignmentGroup: { select: { id: true, name: true } } },
        });
    }
    async createRule(data) {
        return this.db.routingRule.create({
            data: {
                name: data.name,
                priority: data.priority,
                conditions: data.conditions,
                assignmentGroupId: data.assignmentGroupId,
                active: data.active ?? true,
            },
            include: { assignmentGroup: { select: { id: true, name: true } } },
        });
    }
    async updateRule(id, data) {
        return this.db.routingRule.update({
            where: { id },
            data: {
                name: data.name,
                priority: data.priority,
                conditions: data.conditions,
                assignmentGroupId: data.assignmentGroupId,
                active: data.active,
            },
            include: { assignmentGroup: { select: { id: true, name: true } } },
        });
    }
    async deleteRule(id) {
        return this.db.routingRule.delete({ where: { id } });
    }
    async reorderRules(rules) {
        return this.db.$transaction(rules.map((r) => this.db.routingRule.update({
            where: { id: r.id },
            data: { priority: r.priority },
        })));
    }
};
exports.AssignmentGroupsRepository = AssignmentGroupsRepository;
exports.AssignmentGroupsRepository = AssignmentGroupsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], AssignmentGroupsRepository);
//# sourceMappingURL=assignment-groups.repository.js.map
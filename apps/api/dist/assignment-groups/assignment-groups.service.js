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
exports.AssignmentGroupsService = void 0;
const common_1 = require("@nestjs/common");
const assignment_groups_repository_1 = require("./assignment-groups.repository");
let AssignmentGroupsService = class AssignmentGroupsService {
    constructor(repo) {
        this.repo = repo;
    }
    findAllGroups(search) {
        return this.repo.findGroups(search);
    }
    async findOneGroup(id) {
        const group = await this.repo.findGroupById(id);
        if (!group)
            throw new common_1.NotFoundException(`Assignment group ${id} not found`);
        return group;
    }
    createGroup(dto) {
        return this.repo.createGroup(dto);
    }
    async updateGroup(id, dto) {
        await this.findOneGroup(id);
        return this.repo.updateGroup(id, dto);
    }
    async removeGroup(id) {
        await this.findOneGroup(id);
        return this.repo.deleteGroup(id);
    }
    findAllRules() {
        return this.repo.findRules();
    }
    async findOneRule(id) {
        const rule = await this.repo.findRuleById(id);
        if (!rule)
            throw new common_1.NotFoundException(`Routing rule ${id} not found`);
        return rule;
    }
    createRule(dto) {
        return this.repo.createRule(dto);
    }
    async updateRule(id, dto) {
        await this.findOneRule(id);
        return this.repo.updateRule(id, dto);
    }
    async removeRule(id) {
        await this.findOneRule(id);
        return this.repo.deleteRule(id);
    }
    reorderRules(rules) {
        return this.repo.reorderRules(rules);
    }
};
exports.AssignmentGroupsService = AssignmentGroupsService;
exports.AssignmentGroupsService = AssignmentGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assignment_groups_repository_1.AssignmentGroupsRepository])
], AssignmentGroupsService);
//# sourceMappingURL=assignment-groups.service.js.map
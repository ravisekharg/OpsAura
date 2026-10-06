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
exports.RoutingRulesController = exports.AssignmentGroupsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_permission_decorator_1 = require("../rbac/decorators/require-permission.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const assignment_groups_service_1 = require("./assignment-groups.service");
const assignment_group_dto_1 = require("./dto/assignment-group.dto");
let AssignmentGroupsController = class AssignmentGroupsController {
    constructor(service) {
        this.service = service;
    }
    findAll(search) {
        return this.service.findAllGroups(search);
    }
    findOne(id) {
        return this.service.findOneGroup(id);
    }
    create(dto) {
        return this.service.createGroup(dto);
    }
    update(id, dto) {
        return this.service.updateGroup(id, dto);
    }
    remove(id) {
        return this.service.removeGroup(id);
    }
};
exports.AssignmentGroupsController = AssignmentGroupsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.TEAMS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List assignment groups' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssignmentGroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.TEAMS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get assignment group by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssignmentGroupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create assignment group' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assignment_group_dto_1.CreateAssignmentGroupDto]),
    __metadata("design:returntype", void 0)
], AssignmentGroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update assignment group' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assignment_group_dto_1.UpdateAssignmentGroupDto]),
    __metadata("design:returntype", void 0)
], AssignmentGroupsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete assignment group' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssignmentGroupsController.prototype, "remove", null);
exports.AssignmentGroupsController = AssignmentGroupsController = __decorate([
    (0, swagger_1.ApiTags)('Assignment Groups'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('assignment-groups'),
    __metadata("design:paramtypes", [assignment_groups_service_1.AssignmentGroupsService])
], AssignmentGroupsController);
let RoutingRulesController = class RoutingRulesController {
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAllRules();
    }
    findOne(id) {
        return this.service.findOneRule(id);
    }
    create(dto) {
        return this.service.createRule(dto);
    }
    reorder(rules) {
        return this.service.reorderRules(rules);
    }
    update(id, dto) {
        return this.service.updateRule(id, dto);
    }
    remove(id) {
        return this.service.removeRule(id);
    }
};
exports.RoutingRulesController = RoutingRulesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List routing rules ordered by priority' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get routing rule by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create routing rule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assignment_group_dto_1.CreateRoutingRuleDto]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder routing rules by priority' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update routing rule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assignment_group_dto_1.UpdateRoutingRuleDto]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete routing rule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "remove", null);
exports.RoutingRulesController = RoutingRulesController = __decorate([
    (0, swagger_1.ApiTags)('Routing Rules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('routing-rules'),
    __metadata("design:paramtypes", [assignment_groups_service_1.AssignmentGroupsService])
], RoutingRulesController);
//# sourceMappingURL=assignment-groups.controller.js.map
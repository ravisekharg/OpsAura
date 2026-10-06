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
exports.RoutingRulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_permission_decorator_1 = require("../rbac/decorators/require-permission.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const routing_rules_service_1 = require("./routing-rules.service");
const routing_rule_dto_1 = require("./dto/routing-rule.dto");
let RoutingRulesController = class RoutingRulesController {
    constructor(service) {
        this.service = service;
    }
    findAll(assignmentGroupId) {
        return this.service.findAll(assignmentGroupId);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    reorder(dto) {
        return this.service.reorder(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
    test(payload) {
        return this.service.testRule(payload);
    }
};
exports.RoutingRulesController = RoutingRulesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'List routing rules, optionally filtered by assignment group' }),
    __param(0, (0, common_1.Query)('assignmentGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a routing rule by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a routing rule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [routing_rule_dto_1.CreateRoutingRuleDto]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk reorder routing rules by priority' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [routing_rule_dto_1.ReorderRoutingRulesDto]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a routing rule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, routing_rule_dto_1.UpdateRoutingRuleDto]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a routing rule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Test which routing rule matches a given alert payload' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoutingRulesController.prototype, "test", null);
exports.RoutingRulesController = RoutingRulesController = __decorate([
    (0, swagger_1.ApiTags)('Routing Rules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('routing-rules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [routing_rules_service_1.RoutingRulesService])
], RoutingRulesController);
//# sourceMappingURL=routing-rules.controller.js.map
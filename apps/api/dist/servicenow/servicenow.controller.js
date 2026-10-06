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
exports.ServiceNowController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_permission_decorator_1 = require("../rbac/decorators/require-permission.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const servicenow_service_1 = require("./servicenow.service");
const servicenow_dto_1 = require("./dto/servicenow.dto");
let ServiceNowController = class ServiceNowController {
    constructor(service) {
        this.service = service;
    }
    findAllConnections() {
        return this.service.findAllConnections();
    }
    findConnection(id) {
        return this.service.findConnection(id);
    }
    createConnection(dto) {
        return this.service.createConnection(dto);
    }
    updateConnection(id, dto) {
        return this.service.updateConnection(id, dto);
    }
    deleteConnection(id) {
        return this.service.deleteConnection(id);
    }
    testConnection(id) {
        return this.service.testConnection(id);
    }
    syncGroups(id) {
        return this.service.syncGroups(id);
    }
    findMappings(connectionId) {
        return this.service.findMappings(connectionId);
    }
    createMapping(dto) {
        return this.service.createMapping(dto);
    }
    updateMapping(id, dto) {
        return this.service.updateMapping(id, dto);
    }
    deleteMapping(id) {
        return this.service.deleteMapping(id);
    }
    getSyncLogs(id, limit) {
        return this.service.getSyncLogs(id, limit);
    }
};
exports.ServiceNowController = ServiceNowController;
__decorate([
    (0, common_1.Get)('connections'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'List ServiceNow connections' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "findAllConnections", null);
__decorate([
    (0, common_1.Get)('connections/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a ServiceNow connection with mappings' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "findConnection", null);
__decorate([
    (0, common_1.Post)('connections'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a ServiceNow connection' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [servicenow_dto_1.CreateSnConnectionDto]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "createConnection", null);
__decorate([
    (0, common_1.Patch)('connections/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a ServiceNow connection' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, servicenow_dto_1.UpdateSnConnectionDto]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "updateConnection", null);
__decorate([
    (0, common_1.Delete)('connections/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a ServiceNow connection' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "deleteConnection", null);
__decorate([
    (0, common_1.Post)('connections/:id/test'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Test a ServiceNow connection' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Post)('connections/:id/sync'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger a group sync from ServiceNow' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "syncGroups", null);
__decorate([
    (0, common_1.Get)('mappings'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'List group mappings, optionally filtered by connection' }),
    __param(0, (0, common_1.Query)('connectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "findMappings", null);
__decorate([
    (0, common_1.Post)('mappings'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a group mapping' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [servicenow_dto_1.CreateSnMappingDto]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "createMapping", null);
__decorate([
    (0, common_1.Patch)('mappings/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a group mapping' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, servicenow_dto_1.UpdateSnMappingDto]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "updateMapping", null);
__decorate([
    (0, common_1.Delete)('mappings/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a group mapping' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "deleteMapping", null);
__decorate([
    (0, common_1.Get)('connections/:id/sync-logs'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICENOW_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Get sync logs for a connection' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ServiceNowController.prototype, "getSyncLogs", null);
exports.ServiceNowController = ServiceNowController = __decorate([
    (0, swagger_1.ApiTags)('ServiceNow'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('servicenow'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [servicenow_service_1.ServiceNowService])
], ServiceNowController);
//# sourceMappingURL=servicenow.controller.js.map
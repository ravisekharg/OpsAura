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
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_permission_decorator_1 = require("../rbac/decorators/require-permission.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const services_service_1 = require("./services.service");
const service_dto_1 = require("./dto/service.dto");
let ServicesController = class ServicesController {
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    findAll(search) {
        return this.servicesService.findAll(search);
    }
    findOne(id) {
        return this.servicesService.findOne(id);
    }
    create(dto) {
        return this.servicesService.create(dto);
    }
    update(id, dto) {
        return this.servicesService.update(id, dto);
    }
    remove(id) {
        return this.servicesService.remove(id);
    }
    getOwnership(id) {
        return this.servicesService.getOwnership(id);
    }
    setOwnership(id, dto) {
        return this.servicesService.setOwnership(id, dto);
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List all services' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get service by ID with ownership' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new service' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [service_dto_1.CreateServiceDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update service details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_dto_1.UpdateServiceDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICES_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a service' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/ownership'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get service ownership record' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "getOwnership", null);
__decorate([
    (0, common_1.Put)(':id/ownership'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SERVICES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Set or update service ownership' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_dto_1.SetOwnershipDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "setOwnership", null);
exports.ServicesController = ServicesController = __decorate([
    (0, swagger_1.ApiTags)('Services'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('services'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], ServicesController);
//# sourceMappingURL=services.controller.js.map
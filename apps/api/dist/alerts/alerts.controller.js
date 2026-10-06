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
exports.AlertsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_permission_decorator_1 = require("../rbac/decorators/require-permission.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const alerts_service_1 = require("./alerts.service");
const alert_dto_1 = require("./dto/alert.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let AlertsController = class AlertsController {
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    findAll(pagination, query) {
        return this.alertsService.findAll({ ...pagination, ...query });
    }
    findOne(id) {
        return this.alertsService.findOne(id);
    }
    acknowledge(id, user) {
        return this.alertsService.acknowledge(id, user.id);
    }
    resolve(id) {
        return this.alertsService.resolve(id);
    }
    suppress(id) {
        return this.alertsService.suppress(id);
    }
    getSuppressionRules() {
        return this.alertsService.getSuppressionRules();
    }
    createSuppressionRule(body) {
        return this.alertsService.createSuppressionRule(body);
    }
    updateSuppressionRule(id, body) {
        return this.alertsService.updateSuppressionRule(id, body);
    }
    getCorrelationRules() {
        return this.alertsService.getCorrelationRules();
    }
    createCorrelationRule(body) {
        return this.alertsService.createCorrelationRule(body);
    }
    updateCorrelationRule(id, body) {
        return this.alertsService.updateCorrelationRule(id, body);
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List alerts with filters and pagination' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, alert_dto_1.AlertQueryDto]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/acknowledge'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_ACKNOWLEDGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge an alert' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "acknowledge", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_RESOLVE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve an alert' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)(':id/suppress'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Suppress an alert' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "suppress", null);
__decorate([
    (0, common_1.Get)('suppression-rules'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List suppression rules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getSuppressionRules", null);
__decorate([
    (0, common_1.Post)('suppression-rules'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a suppression rule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "createSuppressionRule", null);
__decorate([
    (0, common_1.Patch)('suppression-rules/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a suppression rule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "updateSuppressionRule", null);
__decorate([
    (0, common_1.Get)('correlation-rules'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List correlation rules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getCorrelationRules", null);
__decorate([
    (0, common_1.Post)('correlation-rules'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a correlation rule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "createCorrelationRule", null);
__decorate([
    (0, common_1.Patch)('correlation-rules/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ALERTS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a correlation rule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "updateCorrelationRule", null);
exports.AlertsController = AlertsController = __decorate([
    (0, swagger_1.ApiTags)('Alerts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('alerts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map
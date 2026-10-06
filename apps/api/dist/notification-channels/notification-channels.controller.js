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
exports.NotificationChannelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_permission_decorator_1 = require("../rbac/decorators/require-permission.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const notification_channels_service_1 = require("./notification-channels.service");
const notification_channel_dto_1 = require("./dto/notification-channel.dto");
let NotificationChannelsController = class NotificationChannelsController {
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
    testConnection(id, dto) {
        return this.service.testConnection(id, dto.recipient);
    }
    deliveryLog(id, limit) {
        return this.service.getDeliveryLog(id, limit);
    }
};
exports.NotificationChannelsController = NotificationChannelsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.NOTIFICATIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List all notification channels' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationChannelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.NOTIFICATIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification channel by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationChannelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.NOTIFICATIONS_CONFIGURE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a notification channel' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_channel_dto_1.CreateNotificationChannelDto]),
    __metadata("design:returntype", void 0)
], NotificationChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.NOTIFICATIONS_CONFIGURE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a notification channel' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notification_channel_dto_1.UpdateNotificationChannelDto]),
    __metadata("design:returntype", void 0)
], NotificationChannelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.NOTIFICATIONS_CONFIGURE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a notification channel' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationChannelsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.NOTIFICATIONS_CONFIGURE),
    (0, swagger_1.ApiOperation)({ summary: 'Test a notification channel connection' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notification_channel_dto_1.TestNotificationChannelDto]),
    __metadata("design:returntype", void 0)
], NotificationChannelsController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Get)(':id/delivery-log'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.NOTIFICATIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent delivery log for a channel' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], NotificationChannelsController.prototype, "deliveryLog", null);
exports.NotificationChannelsController = NotificationChannelsController = __decorate([
    (0, swagger_1.ApiTags)('Notification Channels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('notification-channels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notification_channels_service_1.NotificationChannelsService])
], NotificationChannelsController);
//# sourceMappingURL=notification-channels.controller.js.map
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
exports.OnCallController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_permission_decorator_1 = require("../rbac/decorators/require-permission.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const oncall_service_1 = require("./oncall.service");
const oncall_dto_1 = require("./dto/oncall.dto");
let OnCallController = class OnCallController {
    constructor(onCallService) {
        this.onCallService = onCallService;
    }
    getSchedules() { return this.onCallService.getSchedules(); }
    getSchedule(id) { return this.onCallService.getSchedule(id); }
    createSchedule(dto) { return this.onCallService.createSchedule(dto); }
    updateSchedule(id, dto) {
        return this.onCallService.updateSchedule(id, dto);
    }
    deleteSchedule(id) { return this.onCallService.deleteSchedule(id); }
    getRotations(scheduleId) {
        return this.onCallService.getRotations(scheduleId);
    }
    createRotation(dto) { return this.onCallService.createRotation(dto); }
    updateRotation(id, dto) {
        return this.onCallService.updateRotation(id, dto);
    }
    deleteRotation(id) { return this.onCallService.deleteRotation(id); }
    getOverrides(scheduleId) {
        return this.onCallService.getOverrides(scheduleId);
    }
    createOverride(dto, user) {
        return this.onCallService.createOverride(dto, user.id);
    }
    deleteOverride(id) { return this.onCallService.deleteOverride(id); }
    currentOnCall(assignmentGroupId) {
        return this.onCallService.currentOnCall(assignmentGroupId);
    }
    coverage(weekStart) {
        return this.onCallService.coverage(weekStart);
    }
};
exports.OnCallController = OnCallController;
__decorate([
    (0, common_1.Get)('schedules'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List schedules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Get)('schedules/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get schedule by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Post)('schedules'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a schedule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oncall_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Patch)('schedules/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a schedule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, oncall_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)('schedules/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a schedule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Get)('rotations'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List rotations' }),
    __param(0, (0, common_1.Query)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "getRotations", null);
__decorate([
    (0, common_1.Post)('rotations'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a rotation' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oncall_dto_1.CreateRotationDto]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "createRotation", null);
__decorate([
    (0, common_1.Patch)('rotations/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a rotation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, oncall_dto_1.UpdateRotationDto]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "updateRotation", null);
__decorate([
    (0, common_1.Delete)('rotations/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a rotation' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "deleteRotation", null);
__decorate([
    (0, common_1.Get)('overrides'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.SCHEDULES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List overrides' }),
    __param(0, (0, common_1.Query)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "getOverrides", null);
__decorate([
    (0, common_1.Post)('overrides'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.OVERRIDES_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'Create an override' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oncall_dto_1.CreateOverrideDto, Object]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "createOverride", null);
__decorate([
    (0, common_1.Delete)('overrides/:id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.OVERRIDES_CREATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an override' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "deleteOverride", null);
__decorate([
    (0, common_1.Get)('oncall/current'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ONCALL_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Who is on call right now' }),
    __param(0, (0, common_1.Query)('assignmentGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "currentOnCall", null);
__decorate([
    (0, common_1.Get)('oncall/coverage'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.ONCALL_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Weekly coverage grid' }),
    __param(0, (0, common_1.Query)('weekStart')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnCallController.prototype, "coverage", null);
exports.OnCallController = OnCallController = __decorate([
    (0, swagger_1.ApiTags)('OnCall'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [oncall_service_1.OnCallService])
], OnCallController);
//# sourceMappingURL=oncall.controller.js.map
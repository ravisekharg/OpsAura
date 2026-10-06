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
exports.WarRoomTemplatesController = exports.WarRoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_permission_decorator_1 = require("../rbac/decorators/require-permission.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const war_rooms_service_1 = require("./war-rooms.service");
const war_room_dto_1 = require("./dto/war-room.dto");
let WarRoomsController = class WarRoomsController {
    constructor(service) {
        this.service = service;
    }
    findAll(status) {
        return this.service.findAll(status);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto, user) {
        return this.service.create(dto, user.id);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user.id);
    }
    resolve(id, user) {
        return this.service.resolve(id, user.id);
    }
    archive(id, user) {
        return this.service.archive(id, user.id);
    }
    addParticipant(id, dto, user) {
        return this.service.addParticipant(id, dto, user.id);
    }
    removeParticipant(id, userId, user) {
        return this.service.removeParticipant(id, userId, user.id);
    }
    createAction(id, dto, user) {
        return this.service.createAction(id, dto, user.id);
    }
    updateAction(id, actionId, dto, user) {
        return this.service.updateAction(id, actionId, dto, user.id);
    }
    getTimeline(id) {
        return this.service.getTimeline(id);
    }
    addTimelineEntry(id, dto, user) {
        return this.service.addTimelineEntry(id, dto, user.id);
    }
};
exports.WarRoomsController = WarRoomsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List war rooms, optionally filtered by status' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get full war room detail' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new war room' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [war_room_dto_1.CreateWarRoomDto, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update war room details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, war_room_dto_1.UpdateWarRoomDto, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_RESOLVE),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve an active war room' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)(':id/archive'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Archive a war room' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "archive", null);
__decorate([
    (0, common_1.Post)(':id/participants'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Add participant to war room' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, war_room_dto_1.AddParticipantDto, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "addParticipant", null);
__decorate([
    (0, common_1.Delete)(':id/participants/:userId'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove participant from war room' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "removeParticipant", null);
__decorate([
    (0, common_1.Post)(':id/actions'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create an action item' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, war_room_dto_1.CreateActionDto, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "createAction", null);
__decorate([
    (0, common_1.Patch)(':id/actions/:actionId'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update an action item' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('actionId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, war_room_dto_1.UpdateActionDto, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "updateAction", null);
__decorate([
    (0, common_1.Get)(':id/timeline'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get war room timeline' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Post)(':id/timeline'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Add a manual timeline entry' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, war_room_dto_1.AddTimelineEntryDto, Object]),
    __metadata("design:returntype", void 0)
], WarRoomsController.prototype, "addTimelineEntry", null);
exports.WarRoomsController = WarRoomsController = __decorate([
    (0, swagger_1.ApiTags)('War Rooms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('war-rooms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [war_rooms_service_1.WarRoomsService])
], WarRoomsController);
let WarRoomTemplatesController = class WarRoomTemplatesController {
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAllTemplates(); }
    findOne(id) { return this.service.findTemplate(id); }
    create(dto) { return this.service.createTemplate(dto); }
    update(id, dto) {
        return this.service.updateTemplate(id, dto);
    }
    remove(id) { return this.service.deleteTemplate(id); }
};
exports.WarRoomTemplatesController = WarRoomTemplatesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List all war room templates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarRoomTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get a template by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarRoomTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a war room template' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [war_room_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", void 0)
], WarRoomTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update a war room template' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, war_room_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", void 0)
], WarRoomTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_constants_1.PERMISSIONS.WAR_ROOMS_MANAGE),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a war room template' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarRoomTemplatesController.prototype, "remove", null);
exports.WarRoomTemplatesController = WarRoomTemplatesController = __decorate([
    (0, swagger_1.ApiTags)('War Room Templates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('war-room-templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [war_rooms_service_1.WarRoomsService])
], WarRoomTemplatesController);
//# sourceMappingURL=war-rooms.controller.js.map
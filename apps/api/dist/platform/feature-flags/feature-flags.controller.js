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
exports.FeatureFlagsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const platform_guard_1 = require("../guards/platform.guard");
const feature_flags_service_1 = require("./feature-flags.service");
const platform_dto_1 = require("../dto/platform.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class ToggleDto {
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ToggleDto.prototype, "enabled", void 0);
let FeatureFlagsController = class FeatureFlagsController {
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAll(); }
    findOne(id) { return this.service.findOne(id); }
    create(dto) { return this.service.create(dto); }
    toggle(id, dto) {
        return this.service.toggle(id, dto.enabled);
    }
    setOverride(id, dto) {
        return this.service.setTenantOverride(id, dto);
    }
    removeOverride(id, tenantId) {
        return this.service.removeTenantOverride(id, tenantId);
    }
};
exports.FeatureFlagsController = FeatureFlagsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all feature flags with tenant overrides' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FeatureFlagsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feature flag detail' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeatureFlagsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, platform_guard_1.RequirePlatformRole)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a feature flag' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [platform_dto_1.CreateFeatureFlagDto]),
    __metadata("design:returntype", void 0)
], FeatureFlagsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/toggle'),
    (0, platform_guard_1.RequirePlatformRole)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle flag globally' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ToggleDto]),
    __metadata("design:returntype", void 0)
], FeatureFlagsController.prototype, "toggle", null);
__decorate([
    (0, common_1.Post)(':id/overrides'),
    (0, platform_guard_1.RequirePlatformRole)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Set per-tenant override' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_dto_1.SetTenantOverrideDto]),
    __metadata("design:returntype", void 0)
], FeatureFlagsController.prototype, "setOverride", null);
__decorate([
    (0, common_1.Delete)(':id/overrides/:tenantId'),
    (0, platform_guard_1.RequirePlatformRole)('super_admin', 'admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove per-tenant override' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FeatureFlagsController.prototype, "removeOverride", null);
exports.FeatureFlagsController = FeatureFlagsController = __decorate([
    (0, swagger_1.ApiTags)('Platform — Feature Flags'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('platform/feature-flags'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, platform_guard_1.PlatformGuard),
    __metadata("design:paramtypes", [feature_flags_service_1.FeatureFlagsService])
], FeatureFlagsController);
//# sourceMappingURL=feature-flags.controller.js.map
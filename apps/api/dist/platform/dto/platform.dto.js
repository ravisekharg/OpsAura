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
exports.AddDomainDto = exports.SetTenantOverrideDto = exports.CreateFeatureFlagDto = exports.UpdateSubscriptionDto = exports.CreateSubscriptionDto = exports.UpdatePlanDto = exports.CreatePlanDto = exports.UpdateTenantDto = exports.ProvisionTenantDto = exports.PlatformLoginDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class PlatformLoginDto {
}
exports.PlatformLoginDto = PlatformLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@opsaura.io' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], PlatformLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlatformLoginDto.prototype, "password", void 0);
class ProvisionTenantDto {
}
exports.ProvisionTenantDto = ProvisionTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tessell', description: 'Unique slug used as DB name prefix' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 40),
    (0, class_validator_1.Matches)(/^[a-z0-9_-]+$/, { message: 'Slug must be lowercase alphanumeric with hyphens/underscores' }),
    __metadata("design:type", String)
], ProvisionTenantDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tessell Inc.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvisionTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ravi.reddy@tessell.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ProvisionTenantDto.prototype, "adminEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ravi Reddy' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvisionTenantDto.prototype, "adminName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plan ID. Defaults to Starter plan.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProvisionTenantDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'tessell.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvisionTenantDto.prototype, "domain", void 0);
class UpdateTenantDto {
}
exports.UpdateTenantDto = UpdateTenantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ACTIVE', 'SUSPENDED', 'CANCELLED'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ACTIVE', 'SUSPENDED', 'CANCELLED']),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "planId", void 0);
class CreatePlanDto {
}
exports.CreatePlanDto = CreatePlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Starter' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Feature flags JSON e.g. {"voice":true,"war_rooms":false}' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePlanDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resource limits JSON e.g. {"users":50,"services":100}' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePlanDto.prototype, "limits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 99.00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "priceMonthly", void 0);
class UpdatePlanDto {
}
exports.UpdatePlanDto = UpdatePlanDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePlanDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePlanDto.prototype, "limits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "priceMonthly", void 0);
class CreateSubscriptionDto {
}
exports.CreateSubscriptionDto = CreateSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['MONTHLY', 'ANNUAL'], default: 'MONTHLY' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['MONTHLY', 'ANNUAL']),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "billingCycle", void 0);
class UpdateSubscriptionDto {
}
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED']),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['MONTHLY', 'ANNUAL'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['MONTHLY', 'ANNUAL']),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "billingCycle", void 0);
class CreateFeatureFlagDto {
}
exports.CreateFeatureFlagDto = CreateFeatureFlagDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'voice_alerts' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFeatureFlagDto.prototype, "enabled", void 0);
class SetTenantOverrideDto {
}
exports.SetTenantOverrideDto = SetTenantOverrideDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SetTenantOverrideDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SetTenantOverrideDto.prototype, "enabled", void 0);
class AddDomainDto {
}
exports.AddDomainDto = AddDomainDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddDomainDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tessell.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddDomainDto.prototype, "domain", void 0);
//# sourceMappingURL=platform.dto.js.map
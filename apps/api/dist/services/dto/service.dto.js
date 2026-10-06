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
exports.SetOwnershipDto = exports.UpdateServiceDto = exports.CreateServiceDto = exports.ServiceStatus = exports.ServiceTier = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ServiceTier;
(function (ServiceTier) {
    ServiceTier["P0"] = "P0";
    ServiceTier["P1"] = "P1";
    ServiceTier["P2"] = "P2";
    ServiceTier["P3"] = "P3";
})(ServiceTier || (exports.ServiceTier = ServiceTier = {}));
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["ACTIVE"] = "ACTIVE";
    ServiceStatus["INACTIVE"] = "INACTIVE";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
class CreateServiceDto {
    constructor() {
        this.tier = ServiceTier.P2;
        this.status = ServiceStatus.ACTIVE;
    }
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Payments API' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID of owning team' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ServiceTier, default: ServiceTier.P2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ServiceTier),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ServiceStatus, default: ServiceStatus.ACTIVE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ServiceStatus),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "status", void 0);
class UpdateServiceDto {
}
exports.UpdateServiceDto = UpdateServiceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ServiceTier }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ServiceTier),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ServiceStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ServiceStatus),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "status", void 0);
class SetOwnershipDto {
}
exports.SetOwnershipDto = SetOwnershipDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID of primary owner user' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SetOwnershipDto.prototype, "primaryUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID of secondary owner user' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SetOwnershipDto.prototype, "secondaryUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID of assignment group' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SetOwnershipDto.prototype, "assignmentGroupId", void 0);
//# sourceMappingURL=service.dto.js.map
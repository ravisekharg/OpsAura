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
exports.UpdateSnMappingDto = exports.CreateSnMappingDto = exports.UpdateSnConnectionDto = exports.CreateSnConnectionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSnConnectionDto {
}
exports.CreateSnConnectionDto = CreateSnConnectionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateSnConnectionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ServiceNow instance URL, e.g. https://myinstance.service-now.com' }),
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    __metadata("design:type", String)
], CreateSnConnectionDto.prototype, "instanceUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSnConnectionDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ServiceNow user password or API key' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSnConnectionDto.prototype, "password", void 0);
class UpdateSnConnectionDto extends (0, swagger_1.PartialType)(CreateSnConnectionDto) {
}
exports.UpdateSnConnectionDto = UpdateSnConnectionDto;
class CreateSnMappingDto {
}
exports.CreateSnMappingDto = CreateSnMappingDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSnMappingDto.prototype, "connectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ServiceNow assignment group sys_id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSnMappingDto.prototype, "snGroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSnMappingDto.prototype, "snGroupName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OpsAura assignment group ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSnMappingDto.prototype, "localGroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSnMappingDto.prototype, "autoSync", void 0);
class UpdateSnMappingDto extends (0, swagger_1.PartialType)(CreateSnMappingDto) {
}
exports.UpdateSnMappingDto = UpdateSnMappingDto;
//# sourceMappingURL=servicenow.dto.js.map
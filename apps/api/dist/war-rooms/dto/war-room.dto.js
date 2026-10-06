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
exports.UpdateTemplateDto = exports.CreateTemplateDto = exports.AddTimelineEntryDto = exports.UpdateActionDto = exports.CreateActionDto = exports.AddParticipantDto = exports.UpdateWarRoomDto = exports.CreateWarRoomDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateWarRoomDto {
}
exports.CreateWarRoomDto = CreateWarRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateWarRoomDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWarRoomDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] }),
    (0, class_validator_1.IsEnum)(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
    __metadata("design:type", String)
], CreateWarRoomDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWarRoomDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], CreateWarRoomDto.prototype, "alertIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWarRoomDto.prototype, "templateId", void 0);
class UpdateWarRoomDto extends (0, swagger_1.PartialType)(CreateWarRoomDto) {
}
exports.UpdateWarRoomDto = UpdateWarRoomDto;
class AddParticipantDto {
}
exports.AddParticipantDto = AddParticipantDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddParticipantDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['INCIDENT_COMMANDER', 'ENGINEER', 'OBSERVER', 'EXECUTIVE'] }),
    (0, class_validator_1.IsEnum)(['INCIDENT_COMMANDER', 'ENGINEER', 'OBSERVER', 'EXECUTIVE']),
    __metadata("design:type", String)
], AddParticipantDto.prototype, "role", void 0);
class CreateActionDto {
}
exports.CreateActionDto = CreateActionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateActionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "assignedUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "dueAt", void 0);
class UpdateActionDto {
}
exports.UpdateActionDto = UpdateActionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateActionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateActionDto.prototype, "assignedUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['OPEN', 'IN_PROGRESS', 'DONE'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['OPEN', 'IN_PROGRESS', 'DONE']),
    __metadata("design:type", String)
], UpdateActionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateActionDto.prototype, "dueAt", void 0);
class AddTimelineEntryDto {
}
exports.AddTimelineEntryDto = AddTimelineEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], AddTimelineEntryDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTimelineEntryDto.prototype, "type", void 0);
class CreateTemplateDto {
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "defaultRoles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "defaultActions", void 0);
class UpdateTemplateDto extends (0, swagger_1.PartialType)(CreateTemplateDto) {
}
exports.UpdateTemplateDto = UpdateTemplateDto;
//# sourceMappingURL=war-room.dto.js.map
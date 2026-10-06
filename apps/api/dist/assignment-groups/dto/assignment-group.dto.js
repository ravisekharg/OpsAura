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
exports.ReorderRuleDto = exports.UpdateRoutingRuleDto = exports.CreateRoutingRuleDto = exports.RuleConditionDto = exports.UpdateAssignmentGroupDto = exports.CreateAssignmentGroupDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateAssignmentGroupDto {
}
exports.CreateAssignmentGroupDto = CreateAssignmentGroupDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Platform On-Call' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssignmentGroupDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssignmentGroupDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssignmentGroupDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 'Weekly Rotation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssignmentGroupDto.prototype, "oncallPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssignmentGroupDto.prototype, "escalationPolicyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssignmentGroupDto.prototype, "active", void 0);
class UpdateAssignmentGroupDto {
}
exports.UpdateAssignmentGroupDto = UpdateAssignmentGroupDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAssignmentGroupDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAssignmentGroupDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateAssignmentGroupDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAssignmentGroupDto.prototype, "oncallPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateAssignmentGroupDto.prototype, "escalationPolicyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAssignmentGroupDto.prototype, "active", void 0);
class RuleConditionDto {
}
exports.RuleConditionDto = RuleConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'service', enum: ['service', 'severity', 'source', 'tag', 'region'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RuleConditionDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'equals', enum: ['equals', 'contains', 'starts_with', 'in'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RuleConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Payments API' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RuleConditionDto.prototype, "value", void 0);
class CreateRoutingRuleDto {
}
exports.CreateRoutingRuleDto = CreateRoutingRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoutingRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateRoutingRuleDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RuleConditionDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RuleConditionDto),
    __metadata("design:type", Array)
], CreateRoutingRuleDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID of target assignment group' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRoutingRuleDto.prototype, "assignmentGroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRoutingRuleDto.prototype, "active", void 0);
class UpdateRoutingRuleDto {
}
exports.UpdateRoutingRuleDto = UpdateRoutingRuleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRoutingRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateRoutingRuleDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [RuleConditionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RuleConditionDto),
    __metadata("design:type", Array)
], UpdateRoutingRuleDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateRoutingRuleDto.prototype, "assignmentGroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRoutingRuleDto.prototype, "active", void 0);
class ReorderRuleDto {
}
exports.ReorderRuleDto = ReorderRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReorderRuleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReorderRuleDto.prototype, "priority", void 0);
//# sourceMappingURL=assignment-group.dto.js.map
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
exports.ReorderRoutingRulesDto = exports.UpdateRoutingRuleDto = exports.CreateRoutingRuleDto = exports.RuleConditionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class RuleConditionDto {
}
exports.RuleConditionDto = RuleConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Field to match on, e.g. severity, source, tags, title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RuleConditionDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['equals', 'contains', 'starts_with', 'ends_with', 'matches_regex', 'in'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RuleConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
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
    (0, swagger_1.ApiProperty)({ minimum: 1, maximum: 9999 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(9999),
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
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRoutingRuleDto.prototype, "assignmentGroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRoutingRuleDto.prototype, "active", void 0);
class UpdateRoutingRuleDto extends (0, swagger_1.PartialType)(CreateRoutingRuleDto) {
}
exports.UpdateRoutingRuleDto = UpdateRoutingRuleDto;
class ReorderRoutingRulesDto {
}
exports.ReorderRoutingRulesDto = ReorderRoutingRulesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of { id, priority } to bulk-reorder rules' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ReorderRoutingRulesDto.prototype, "rules", void 0);
//# sourceMappingURL=routing-rule.dto.js.map
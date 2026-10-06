import { IsString, IsInt, IsUUID, IsBoolean, IsOptional, IsArray, Min, Max, ValidateNested } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class RuleConditionDto {
  @ApiProperty({ description: 'Field to match on, e.g. severity, source, tags, title' })
  @IsString()
  field: string

  @ApiProperty({ enum: ['equals', 'contains', 'starts_with', 'ends_with', 'matches_regex', 'in'] })
  @IsString()
  operator: string

  @ApiProperty()
  value: string | string[]
}

export class CreateRoutingRuleDto {
  @ApiProperty() @IsString()
  name: string

  @ApiProperty({ minimum: 1, maximum: 9999 })
  @IsInt() @Min(1) @Max(9999)
  priority: number

  @ApiProperty({ type: [RuleConditionDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => RuleConditionDto)
  conditions: RuleConditionDto[]

  @ApiProperty() @IsUUID()
  assignmentGroupId: string

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  active?: boolean
}

export class UpdateRoutingRuleDto extends PartialType(CreateRoutingRuleDto) {}

export class ReorderRoutingRulesDto {
  @ApiProperty({ description: 'Array of { id, priority } to bulk-reorder rules' })
  @IsArray()
  rules: { id: string; priority: number }[]
}

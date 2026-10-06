import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsInt,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAssignmentGroupDto {
  @ApiProperty({ example: 'Platform On-Call' })
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  teamId?: string

  @ApiPropertyOptional({ default: 'Weekly Rotation' })
  @IsOptional()
  @IsString()
  oncallPolicy?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  escalationPolicyId?: string

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}

export class UpdateAssignmentGroupDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  teamId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  oncallPolicy?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  escalationPolicyId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean
}

export class RuleConditionDto {
  @ApiProperty({ example: 'service', enum: ['service', 'severity', 'source', 'tag', 'region'] })
  @IsString()
  field: string

  @ApiProperty({ example: 'equals', enum: ['equals', 'contains', 'starts_with', 'in'] })
  @IsString()
  operator: string

  @ApiProperty({ example: 'Payments API' })
  @IsString()
  value: string
}

export class CreateRoutingRuleDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsInt()
  @Min(1)
  priority: number

  @ApiProperty({ type: [RuleConditionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleConditionDto)
  conditions: RuleConditionDto[]

  @ApiProperty({ description: 'UUID of target assignment group' })
  @IsUUID()
  assignmentGroupId: string

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}

export class UpdateRoutingRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  priority?: number

  @ApiPropertyOptional({ type: [RuleConditionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleConditionDto)
  conditions?: RuleConditionDto[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignmentGroupId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean
}

export class ReorderRuleDto {
  @ApiProperty()
  @IsUUID()
  id: string

  @ApiProperty()
  @IsInt()
  @Min(1)
  priority: number
}

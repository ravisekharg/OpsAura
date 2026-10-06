import { IsString, IsOptional, IsUUID, IsEnum, IsBoolean, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateScheduleDto {
  @ApiProperty() @IsString() name: string
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
  @ApiPropertyOptional() @IsOptional() @IsUUID() teamId?: string
  @ApiProperty({ example: 'Asia/Kolkata' }) @IsString() timezone: string
}
export class UpdateScheduleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
  @ApiPropertyOptional() @IsOptional() @IsUUID() teamId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string
  @ApiPropertyOptional() @IsOptional() @IsBoolean() active?: boolean
}

export class RotationMemberDto {
  @IsString() userId: string
  @IsString() name: string
  @IsString() email: string
  @IsOptional() order?: number
}

export class CreateRotationDto {
  @ApiProperty() @IsUUID() scheduleId: string
  @ApiProperty() @IsString() name: string
  @ApiProperty({ enum: ['WEEKLY', 'DAILY', 'CUSTOM'] }) @IsEnum(['WEEKLY', 'DAILY', 'CUSTOM']) type: string
  @ApiProperty({ type: [RotationMemberDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => RotationMemberDto) members: RotationMemberDto[]
  @ApiPropertyOptional() @IsOptional() @IsString() handoffDay?: string
  @ApiPropertyOptional() @IsOptional() @IsString() handoffTime?: string
}
export class UpdateRotationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string
  @ApiPropertyOptional() @IsOptional() @IsArray() members?: RotationMemberDto[]
  @ApiPropertyOptional() @IsOptional() @IsString() handoffDay?: string
  @ApiPropertyOptional() @IsOptional() @IsBoolean() active?: boolean
}

export class CreateOverrideDto {
  @ApiProperty() @IsUUID() scheduleId: string
  @ApiProperty() @IsUUID() originalUserId: string
  @ApiProperty() @IsUUID() overrideUserId: string
  @ApiProperty() @IsString() startAt: string
  @ApiProperty() @IsString() endAt: string
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string
}

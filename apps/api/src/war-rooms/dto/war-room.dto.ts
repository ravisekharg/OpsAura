import {
  IsString, IsOptional, IsEnum, IsArray, IsUUID, IsDateString,
  MinLength, MaxLength, IsBoolean,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

export class CreateWarRoomDto {
  @ApiProperty() @IsString() @MinLength(3) @MaxLength(200)
  title: string

  @ApiPropertyOptional() @IsOptional() @IsString()
  description?: string

  @ApiProperty({ enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] })
  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'])
  severity: string

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  serviceId?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsUUID(undefined, { each: true })
  alertIds?: string[]

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  templateId?: string
}

export class UpdateWarRoomDto extends PartialType(CreateWarRoomDto) {}

export class AddParticipantDto {
  @ApiProperty() @IsUUID()
  userId: string

  @ApiProperty({ enum: ['INCIDENT_COMMANDER', 'ENGINEER', 'OBSERVER', 'EXECUTIVE'] })
  @IsEnum(['INCIDENT_COMMANDER', 'ENGINEER', 'OBSERVER', 'EXECUTIVE'])
  role: string
}

export class CreateActionDto {
  @ApiProperty() @IsString() @MinLength(3)
  title: string

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  assignedUserId?: string

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  dueAt?: string
}

export class UpdateActionDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  title?: string

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  assignedUserId?: string

  @ApiPropertyOptional({ enum: ['OPEN', 'IN_PROGRESS', 'DONE'] })
  @IsOptional() @IsEnum(['OPEN', 'IN_PROGRESS', 'DONE'])
  status?: string

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  dueAt?: string
}

export class AddTimelineEntryDto {
  @ApiProperty() @IsString() @MinLength(1)
  message: string

  @ApiPropertyOptional() @IsOptional() @IsString()
  type?: string
}

export class CreateTemplateDto {
  @ApiProperty() @IsString() @MinLength(3)
  name: string

  @ApiPropertyOptional() @IsOptional() @IsString()
  description?: string

  @ApiPropertyOptional({ type: [Object] })
  @IsOptional() @IsArray()
  defaultRoles?: object[]

  @ApiPropertyOptional({ type: [Object] })
  @IsOptional() @IsArray()
  defaultActions?: object[]
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}

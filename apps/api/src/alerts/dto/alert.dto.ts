import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export enum AlertSeverityFilter {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

export enum AlertStatusFilter {
  FIRING = 'FIRING',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  SUPPRESSED = 'SUPPRESSED',
}

export class AlertQueryDto {
  @ApiPropertyOptional({ enum: AlertStatusFilter })
  @IsOptional()
  @IsEnum(AlertStatusFilter)
  status?: AlertStatusFilter

  @ApiPropertyOptional({ enum: AlertSeverityFilter })
  @IsOptional()
  @IsEnum(AlertSeverityFilter)
  severity?: AlertSeverityFilter

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  serviceId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignmentGroupId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string
}

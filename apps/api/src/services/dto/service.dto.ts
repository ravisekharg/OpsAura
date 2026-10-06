import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum ServiceTier {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class CreateServiceDto {
  @ApiProperty({ example: 'Payments API' })
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'UUID of owning team' })
  @IsOptional()
  @IsUUID()
  teamId?: string

  @ApiPropertyOptional({ enum: ServiceTier, default: ServiceTier.P2 })
  @IsOptional()
  @IsEnum(ServiceTier)
  tier?: ServiceTier = ServiceTier.P2

  @ApiPropertyOptional({ enum: ServiceStatus, default: ServiceStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus = ServiceStatus.ACTIVE
}

export class UpdateServiceDto {
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

  @ApiPropertyOptional({ enum: ServiceTier })
  @IsOptional()
  @IsEnum(ServiceTier)
  tier?: ServiceTier

  @ApiPropertyOptional({ enum: ServiceStatus })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus
}

export class SetOwnershipDto {
  @ApiPropertyOptional({ description: 'UUID of primary owner user' })
  @IsOptional()
  @IsUUID()
  primaryUserId?: string

  @ApiPropertyOptional({ description: 'UUID of secondary owner user' })
  @IsOptional()
  @IsUUID()
  secondaryUserId?: string

  @ApiPropertyOptional({ description: 'UUID of assignment group' })
  @IsOptional()
  @IsUUID()
  assignmentGroupId?: string
}

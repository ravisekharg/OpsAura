import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsNumber,
  Min,
  IsObject,
  Matches,
  Length,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// ─── Platform Auth ────────────────────────────────────────────────────────────

export class PlatformLoginDto {
  @ApiProperty({ example: 'admin@opsaura.io' })
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  password: string
}

// ─── Tenants ──────────────────────────────────────────────────────────────────

export class ProvisionTenantDto {
  @ApiProperty({ example: 'tessell', description: 'Unique slug used as DB name prefix' })
  @IsString()
  @Length(2, 40)
  @Matches(/^[a-z0-9_-]+$/, { message: 'Slug must be lowercase alphanumeric with hyphens/underscores' })
  slug: string

  @ApiProperty({ example: 'Tessell Inc.' })
  @IsString()
  name: string

  @ApiProperty({ example: 'ravi.reddy@tessell.com' })
  @IsEmail()
  adminEmail: string

  @ApiProperty({ example: 'Ravi Reddy' })
  @IsString()
  adminName: string

  @ApiPropertyOptional({ description: 'Plan ID. Defaults to Starter plan.' })
  @IsOptional()
  @IsUUID()
  planId?: string

  @ApiPropertyOptional({ example: 'tessell.com' })
  @IsOptional()
  @IsString()
  domain?: string
}

export class UpdateTenantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ enum: ['ACTIVE', 'SUSPENDED', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['ACTIVE', 'SUSPENDED', 'CANCELLED'])
  status?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  planId?: string
}

// ─── Plans ────────────────────────────────────────────────────────────────────

export class CreatePlanDto {
  @ApiProperty({ example: 'Starter' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: 'Feature flags JSON e.g. {"voice":true,"war_rooms":false}' })
  @IsOptional()
  @IsObject()
  features?: Record<string, unknown>

  @ApiPropertyOptional({ description: 'Resource limits JSON e.g. {"users":50,"services":100}' })
  @IsOptional()
  @IsObject()
  limits?: Record<string, unknown>

  @ApiPropertyOptional({ example: 99.00 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMonthly?: number
}

export class UpdatePlanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  features?: Record<string, unknown>

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  limits?: Record<string, unknown>

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMonthly?: number
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string

  @ApiProperty()
  @IsUUID()
  planId: string

  @ApiPropertyOptional({ enum: ['MONTHLY', 'ANNUAL'], default: 'MONTHLY' })
  @IsOptional()
  @IsEnum(['MONTHLY', 'ANNUAL'])
  billingCycle?: string
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ enum: ['TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED'])
  status?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  planId?: string

  @ApiPropertyOptional({ enum: ['MONTHLY', 'ANNUAL'] })
  @IsOptional()
  @IsEnum(['MONTHLY', 'ANNUAL'])
  billingCycle?: string
}

// ─── Feature Flags ────────────────────────────────────────────────────────────

export class CreateFeatureFlagDto {
  @ApiProperty({ example: 'voice_alerts' })
  @IsString()
  name: string

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean
}

export class SetTenantOverrideDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string

  @ApiProperty()
  @IsBoolean()
  enabled: boolean
}

// ─── Domains ─────────────────────────────────────────────────────────────────

export class AddDomainDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string

  @ApiProperty({ example: 'tessell.com' })
  @IsString()
  domain: string
}

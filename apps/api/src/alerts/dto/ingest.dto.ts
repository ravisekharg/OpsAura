import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum IngestSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

// ─── Generic Ingest ───────────────────────────────────────────────────────────

export class GenericIngestDto {
  @ApiProperty({ example: 'DB connection pool exhausted' })
  @IsString()
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ enum: IngestSeverity, default: IngestSeverity.MEDIUM })
  @IsOptional()
  @IsEnum(IngestSeverity)
  severity?: IngestSeverity

  @ApiPropertyOptional({ example: 'Prometheus' })
  @IsOptional()
  @IsString()
  source?: string

  @ApiPropertyOptional({ example: 'Auth Service', description: 'Service name to match against services table' })
  @IsOptional()
  @IsString()
  service?: string

  @ApiPropertyOptional({ example: ['db', 'postgres', 'prod'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiPropertyOptional({ description: 'Stable string used for deduplication. Auto-generated if omitted.' })
  @IsOptional()
  @IsString()
  fingerprint?: string

  @ApiPropertyOptional({ description: 'Any additional payload stored as raw JSON' })
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>
}

// ─── Prometheus Alertmanager ──────────────────────────────────────────────────

export class PrometheusAnnotationsDto {
  @IsOptional() @IsString() summary?: string
  @IsOptional() @IsString() description?: string
  @IsOptional() @IsString() runbook_url?: string
}

export class PrometheusLabelsDto {
  @IsOptional() @IsString() alertname?: string
  @IsOptional() @IsString() severity?: string
  @IsOptional() @IsString() service?: string
  @IsOptional() @IsString() namespace?: string
  @IsOptional() @IsString() pod?: string
  [key: string]: string | undefined
}

export class PrometheusAlertDto {
  @IsString() status: string
  @IsOptional() @ValidateNested() @Type(() => PrometheusLabelsDto) labels?: PrometheusLabelsDto
  @IsOptional() @ValidateNested() @Type(() => PrometheusAnnotationsDto) annotations?: PrometheusAnnotationsDto
  @IsOptional() @IsString() startsAt?: string
  @IsOptional() @IsString() endsAt?: string
  @IsOptional() @IsString() fingerprint?: string
}

export class PrometheusWebhookDto {
  @IsString() version: string
  @IsString() groupKey: string
  @IsString() status: string
  @IsOptional() @IsNumber() truncatedAlerts?: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrometheusAlertDto)
  alerts: PrometheusAlertDto[]

  @IsOptional() @IsObject() groupLabels?: Record<string, string>
  @IsOptional() @IsObject() commonLabels?: Record<string, string>
  @IsOptional() @IsObject() commonAnnotations?: Record<string, string>
}

// ─── Normalized Internal Alert ────────────────────────────────────────────────

export interface NormalizedAlert {
  title: string
  description?: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  source: string
  serviceName?: string
  tags: string[]
  fingerprint: string
  rawPayload: Record<string, unknown>
}

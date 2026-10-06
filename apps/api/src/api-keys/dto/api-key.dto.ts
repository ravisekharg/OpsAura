import { IsString, IsOptional, IsArray, IsDateString, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateApiKeyDto {
  @ApiProperty({ description: 'Human-readable name for this API key' })
  @IsString() @MinLength(3) @MaxLength(80)
  name: string

  @ApiPropertyOptional({ description: 'Scopes granted to this key, e.g. ["alerts:view","alerts:manage"]', type: [String] })
  @IsOptional() @IsArray()
  scopes?: string[]

  @ApiPropertyOptional({ description: 'ISO date when this key expires. Omit for no expiry.' })
  @IsOptional() @IsDateString()
  expiresAt?: string
}

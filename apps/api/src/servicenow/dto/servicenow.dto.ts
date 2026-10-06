import { IsString, IsOptional, IsUUID, IsBoolean, IsUrl, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

export class CreateSnConnectionDto {
  @ApiProperty() @IsString() @MinLength(3)
  name: string

  @ApiProperty({ description: 'ServiceNow instance URL, e.g. https://myinstance.service-now.com' })
  @IsUrl({ require_tld: false })
  instanceUrl: string

  @ApiProperty() @IsString()
  username: string

  @ApiProperty({ description: 'ServiceNow user password or API key' })
  @IsString()
  password: string
}

export class UpdateSnConnectionDto extends PartialType(CreateSnConnectionDto) {}

export class CreateSnMappingDto {
  @ApiProperty() @IsUUID()
  connectionId: string

  @ApiProperty({ description: 'ServiceNow assignment group sys_id' })
  @IsString()
  snGroupId: string

  @ApiPropertyOptional() @IsOptional() @IsString()
  snGroupName?: string

  @ApiProperty({ description: 'OpsAura assignment group ID' })
  @IsUUID()
  localGroupId: string

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  autoSync?: boolean
}

export class UpdateSnMappingDto extends PartialType(CreateSnMappingDto) {}

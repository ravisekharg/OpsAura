import { IsString, IsEnum, IsOptional, IsBoolean, ValidateNested, IsObject } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class EmailConfigDto {
  @IsString() host: string
  @IsString() port: string
  @IsString() user: string
  @IsString() password: string
  @IsString() from: string
  @IsOptional() @IsBoolean() tls?: boolean
}

export class SlackConfigDto {
  @IsString() webhookUrl: string
  @IsOptional() @IsString() channel?: string
}

export class TeamsConfigDto {
  @IsString() webhookUrl: string
}

export class VoiceConfigDto {
  @IsString() accountSid: string
  @IsString() authToken: string
  @IsString() fromNumber: string
}

export class CreateNotificationChannelDto {
  @ApiProperty() @IsString()
  name: string

  @ApiProperty({ enum: ['EMAIL', 'SLACK', 'TEAMS', 'VOICE'] })
  @IsEnum(['EMAIL', 'SLACK', 'TEAMS', 'VOICE'])
  type: string

  @ApiProperty({ description: 'Channel-specific configuration' })
  @IsObject()
  config: EmailConfigDto | SlackConfigDto | TeamsConfigDto | VoiceConfigDto
}

export class UpdateNotificationChannelDto extends PartialType(CreateNotificationChannelDto) {}

export class TestNotificationChannelDto {
  @ApiPropertyOptional({ description: 'Optional recipient to send test to' })
  @IsOptional() @IsString()
  recipient?: string
}

import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class MfaEnrollConfirmDto {
  @ApiProperty({ description: '6-digit TOTP code to confirm enrollment' })
  @IsString() @Length(6, 6)
  code: string
}

export class MfaDisableDto {
  @ApiProperty({ description: '6-digit TOTP code or current password to disable MFA' })
  @IsString() @Length(6, 6)
  code: string
}

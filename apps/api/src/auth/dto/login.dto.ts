import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'ravi.reddy@tessell.com' })
  @IsEmail()
  email: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string

  @ApiPropertyOptional({
    example: 'tessell',
    description: 'Tenant slug. Required for tenant users. Omit for platform users.',
  })
  @IsOptional()
  @IsString()
  tenantSlug?: string
}

export class MfaVerifyDto {
  @ApiProperty({ description: 'Short-lived MFA session token from first login step' })
  @IsString()
  mfaToken: string

  @ApiProperty({ description: '6-digit TOTP code' })
  @IsString()
  code: string
}

import { IsEmail, IsString, MinLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'ravi.reddy@tessell.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'tessell' })
  @IsString()
  tenantSlug: string
}

export class ConfirmPasswordResetDto {
  @ApiProperty({ description: 'Reset token from email link' })
  @IsString()
  token: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  newPassword: string
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  newPassword: string
}

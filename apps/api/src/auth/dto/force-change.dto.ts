import { IsString, MinLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ForceChangePasswordDto {
  @ApiProperty({ description: 'Current temporary password' })
  @IsString()
  currentPassword: string

  @ApiProperty({ minLength: 8, description: 'New password — must include upper, lower, number, special char' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain uppercase, lowercase, number and special character',
  })
  newPassword: string
}

import { IsString, IsOptional, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateTeamDto {
  @ApiProperty({ example: 'Platform Engineering' })
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'UUID of team lead user' })
  @IsOptional()
  @IsUUID()
  leadUserId?: string
}

export class UpdateTeamDto {
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
  leadUserId?: string
}

export class AddMemberDto {
  @ApiProperty({ description: 'UUID of user to add to team' })
  @IsUUID()
  userId: string
}

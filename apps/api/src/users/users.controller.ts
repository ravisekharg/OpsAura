import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RequirePermission } from '../rbac/decorators/require-permission.decorator'
import { PERMISSIONS } from '../common/constants/permissions.constants'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { InviteUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto'
import type { RequestUser } from '../common/interfaces/request-user.interface'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission(PERMISSIONS.USERS_VIEW)
  @ApiOperation({ summary: 'List users with pagination and search' })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query)
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.USERS_VIEW)
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Post('invite')
  @RequirePermission(PERMISSIONS.USERS_INVITE)
  @ApiOperation({ summary: 'Invite a new user (sends invite email)' })
  invite(@Body() dto: InviteUserDto, @CurrentUser() user: RequestUser) {
    return this.usersService.invite(dto, user.id)
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.USERS_MANAGE)
  @ApiOperation({ summary: 'Update user name, role or status' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.USERS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a user' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id)
  }

  @Post(':id/resend-invite')
  @RequirePermission(PERMISSIONS.USERS_INVITE)
  @ApiOperation({ summary: 'Resend invite email to a pending user' })
  resendInvite(@Param('id') id: string) {
    return this.usersService.resendInvite(id)
  }
}

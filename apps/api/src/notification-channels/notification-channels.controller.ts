import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RequirePermission } from '../rbac/decorators/require-permission.decorator'
import { PERMISSIONS } from '../common/constants/permissions.constants'
import { NotificationChannelsService } from './notification-channels.service'
import {
  CreateNotificationChannelDto,
  UpdateNotificationChannelDto,
  TestNotificationChannelDto,
} from './dto/notification-channel.dto'

@ApiTags('Notification Channels')
@ApiBearerAuth()
@Controller('notification-channels')
@UseGuards(JwtAuthGuard)
export class NotificationChannelsController {
  constructor(private readonly service: NotificationChannelsService) {}

  @Get()
  @RequirePermission(PERMISSIONS.NOTIFICATIONS_VIEW)
  @ApiOperation({ summary: 'List all notification channels' })
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.NOTIFICATIONS_VIEW)
  @ApiOperation({ summary: 'Get notification channel by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @RequirePermission(PERMISSIONS.NOTIFICATIONS_CONFIGURE)
  @ApiOperation({ summary: 'Create a notification channel' })
  create(@Body() dto: CreateNotificationChannelDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.NOTIFICATIONS_CONFIGURE)
  @ApiOperation({ summary: 'Update a notification channel' })
  update(@Param('id') id: string, @Body() dto: UpdateNotificationChannelDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.NOTIFICATIONS_CONFIGURE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a notification channel' })
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }

  @Post(':id/test')
  @RequirePermission(PERMISSIONS.NOTIFICATIONS_CONFIGURE)
  @ApiOperation({ summary: 'Test a notification channel connection' })
  testConnection(@Param('id') id: string, @Body() dto: TestNotificationChannelDto) {
    return this.service.testConnection(id, dto.recipient)
  }

  @Get(':id/delivery-log')
  @RequirePermission(PERMISSIONS.NOTIFICATIONS_VIEW)
  @ApiOperation({ summary: 'Get recent delivery log for a channel' })
  deliveryLog(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.service.getDeliveryLog(id, limit)
  }
}

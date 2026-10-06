import {
  Controller, Get, Post, Patch, Body, Param, Query,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { PlatformGuard, RequirePlatformRole } from '../guards/platform.guard'
import { SubscriptionsService } from './subscriptions.service'
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/platform.dto'

@ApiTags('Platform — Subscriptions')
@ApiBearerAuth()
@Controller('platform/subscriptions')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'List subscriptions, optionally filter by tenantId' })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.service.findAll(tenantId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id) }

  @Post()
  @RequirePlatformRole('super_admin', 'admin', 'billing_admin')
  @ApiOperation({ summary: 'Create subscription for a tenant' })
  create(@Body() dto: CreateSubscriptionDto) { return this.service.create(dto) }

  @Patch(':id')
  @RequirePlatformRole('super_admin', 'admin', 'billing_admin')
  @ApiOperation({ summary: 'Update subscription status or plan' })
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.service.update(id, dto)
  }

  @Post(':id/cancel')
  @RequirePlatformRole('super_admin', 'admin', 'billing_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel subscription' })
  cancel(@Param('id') id: string) { return this.service.cancel(id) }
}

import {
  Controller,
  Get,
  Post,
  Patch,
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
import { AlertsService } from './alerts.service'
import { AlertQueryDto } from './dto/alert.dto'
import { PaginationDto } from '../common/dto/pagination.dto'
import type { RequestUser } from '../common/interfaces/request-user.interface'

@ApiTags('Alerts')
@ApiBearerAuth()
@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @RequirePermission(PERMISSIONS.ALERTS_VIEW)
  @ApiOperation({ summary: 'List alerts with filters and pagination' })
  findAll(@Query() pagination: PaginationDto, @Query() query: AlertQueryDto) {
    return this.alertsService.findAll({ ...pagination, ...query })
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.ALERTS_VIEW)
  @ApiOperation({ summary: 'Get alert by ID' })
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id)
  }

  @Post(':id/acknowledge')
  @RequirePermission(PERMISSIONS.ALERTS_ACKNOWLEDGE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acknowledge an alert' })
  acknowledge(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.alertsService.acknowledge(id, user.id)
  }

  @Post(':id/resolve')
  @RequirePermission(PERMISSIONS.ALERTS_RESOLVE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve an alert' })
  resolve(@Param('id') id: string) {
    return this.alertsService.resolve(id)
  }

  @Post(':id/suppress')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suppress an alert' })
  suppress(@Param('id') id: string) {
    return this.alertsService.suppress(id)
  }

  // ─── Suppression Rules ──────────────────────────────────────────────────────

  @Get('suppression-rules')
  @RequirePermission(PERMISSIONS.ALERTS_VIEW)
  @ApiOperation({ summary: 'List suppression rules' })
  getSuppressionRules() {
    return this.alertsService.getSuppressionRules()
  }

  @Post('suppression-rules')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Create a suppression rule' })
  createSuppressionRule(@Body() body: Record<string, unknown>) {
    return this.alertsService.createSuppressionRule(body)
  }

  @Patch('suppression-rules/:id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Update a suppression rule' })
  updateSuppressionRule(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.alertsService.updateSuppressionRule(id, body)
  }

  // ─── Correlation Rules ──────────────────────────────────────────────────────

  @Get('correlation-rules')
  @RequirePermission(PERMISSIONS.ALERTS_VIEW)
  @ApiOperation({ summary: 'List correlation rules' })
  getCorrelationRules() {
    return this.alertsService.getCorrelationRules()
  }

  @Post('correlation-rules')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Create a correlation rule' })
  createCorrelationRule(@Body() body: Record<string, unknown>) {
    return this.alertsService.createCorrelationRule(body)
  }

  @Patch('correlation-rules/:id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Update a correlation rule' })
  updateCorrelationRule(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.alertsService.updateCorrelationRule(id, body)
  }
}

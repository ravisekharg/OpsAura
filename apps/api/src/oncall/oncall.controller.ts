import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RequirePermission } from '../rbac/decorators/require-permission.decorator'
import { PERMISSIONS } from '../common/constants/permissions.constants'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { OnCallService } from './oncall.service'
import {
  CreateScheduleDto, UpdateScheduleDto,
  CreateRotationDto, UpdateRotationDto,
  CreateOverrideDto,
} from './dto/oncall.dto'
import type { RequestUser } from '../common/interfaces/request-user.interface'

@ApiTags('OnCall')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard)
export class OnCallController {
  constructor(private readonly onCallService: OnCallService) {}

  // ── Schedules ─────────────────────────────────────────────────────────────

  @Get('schedules')
  @RequirePermission(PERMISSIONS.SCHEDULES_VIEW)
  @ApiOperation({ summary: 'List schedules' })
  getSchedules() { return this.onCallService.getSchedules() }

  @Get('schedules/:id')
  @RequirePermission(PERMISSIONS.SCHEDULES_VIEW)
  @ApiOperation({ summary: 'Get schedule by ID' })
  getSchedule(@Param('id') id: string) { return this.onCallService.getSchedule(id) }

  @Post('schedules')
  @RequirePermission(PERMISSIONS.SCHEDULES_MANAGE)
  @ApiOperation({ summary: 'Create a schedule' })
  createSchedule(@Body() dto: CreateScheduleDto) { return this.onCallService.createSchedule(dto) }

  @Patch('schedules/:id')
  @RequirePermission(PERMISSIONS.SCHEDULES_MANAGE)
  @ApiOperation({ summary: 'Update a schedule' })
  updateSchedule(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.onCallService.updateSchedule(id, dto)
  }

  @Delete('schedules/:id')
  @RequirePermission(PERMISSIONS.SCHEDULES_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a schedule' })
  deleteSchedule(@Param('id') id: string) { return this.onCallService.deleteSchedule(id) }

  // ── Rotations ─────────────────────────────────────────────────────────────

  @Get('rotations')
  @RequirePermission(PERMISSIONS.SCHEDULES_VIEW)
  @ApiOperation({ summary: 'List rotations' })
  getRotations(@Query('scheduleId') scheduleId?: string) {
    return this.onCallService.getRotations(scheduleId)
  }

  @Post('rotations')
  @RequirePermission(PERMISSIONS.SCHEDULES_MANAGE)
  @ApiOperation({ summary: 'Create a rotation' })
  createRotation(@Body() dto: CreateRotationDto) { return this.onCallService.createRotation(dto) }

  @Patch('rotations/:id')
  @RequirePermission(PERMISSIONS.SCHEDULES_MANAGE)
  @ApiOperation({ summary: 'Update a rotation' })
  updateRotation(@Param('id') id: string, @Body() dto: UpdateRotationDto) {
    return this.onCallService.updateRotation(id, dto)
  }

  @Delete('rotations/:id')
  @RequirePermission(PERMISSIONS.SCHEDULES_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a rotation' })
  deleteRotation(@Param('id') id: string) { return this.onCallService.deleteRotation(id) }

  // ── Overrides ─────────────────────────────────────────────────────────────

  @Get('overrides')
  @RequirePermission(PERMISSIONS.SCHEDULES_VIEW)
  @ApiOperation({ summary: 'List overrides' })
  getOverrides(@Query('scheduleId') scheduleId?: string) {
    return this.onCallService.getOverrides(scheduleId)
  }

  @Post('overrides')
  @RequirePermission(PERMISSIONS.OVERRIDES_CREATE)
  @ApiOperation({ summary: 'Create an override' })
  createOverride(@Body() dto: CreateOverrideDto, @CurrentUser() user: RequestUser) {
    return this.onCallService.createOverride(dto, user.id)
  }

  @Delete('overrides/:id')
  @RequirePermission(PERMISSIONS.OVERRIDES_CREATE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an override' })
  deleteOverride(@Param('id') id: string) { return this.onCallService.deleteOverride(id) }

  // ── Who is on-call ────────────────────────────────────────────────────────

  @Get('oncall/current')
  @RequirePermission(PERMISSIONS.ONCALL_VIEW)
  @ApiOperation({ summary: 'Who is on call right now' })
  currentOnCall(@Query('assignmentGroupId') assignmentGroupId?: string) {
    return this.onCallService.currentOnCall(assignmentGroupId)
  }

  @Get('oncall/coverage')
  @RequirePermission(PERMISSIONS.ONCALL_VIEW)
  @ApiOperation({ summary: 'Weekly coverage grid' })
  coverage(@Query('weekStart') weekStart?: string) {
    return this.onCallService.coverage(weekStart)
  }
}

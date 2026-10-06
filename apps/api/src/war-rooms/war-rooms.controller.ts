import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RequirePermission } from '../rbac/decorators/require-permission.decorator'
import { PERMISSIONS } from '../common/constants/permissions.constants'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { WarRoomsService } from './war-rooms.service'
import {
  CreateWarRoomDto, UpdateWarRoomDto, AddParticipantDto,
  CreateActionDto, UpdateActionDto, AddTimelineEntryDto,
  CreateTemplateDto, UpdateTemplateDto,
} from './dto/war-room.dto'
import type { RequestUser } from '../common/interfaces/request-user.interface'

@ApiTags('War Rooms')
@ApiBearerAuth()
@Controller('war-rooms')
@UseGuards(JwtAuthGuard)
export class WarRoomsController {
  constructor(private readonly service: WarRoomsService) {}

  // ── War Rooms ────────────────────────────────────────────────────────────

  @Get()
  @RequirePermission(PERMISSIONS.WAR_ROOMS_VIEW)
  @ApiOperation({ summary: 'List war rooms, optionally filtered by status' })
  findAll(@Query('status') status?: string) {
    return this.service.findAll(status)
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_VIEW)
  @ApiOperation({ summary: 'Get full war room detail' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @RequirePermission(PERMISSIONS.WAR_ROOMS_CREATE)
  @ApiOperation({ summary: 'Create a new war room' })
  create(@Body() dto: CreateWarRoomDto, @CurrentUser() user: RequestUser) {
    return this.service.create(dto, user.id)
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @ApiOperation({ summary: 'Update war room details' })
  update(@Param('id') id: string, @Body() dto: UpdateWarRoomDto, @CurrentUser() user: RequestUser) {
    return this.service.update(id, dto, user.id)
  }

  @Post(':id/resolve')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_RESOLVE)
  @ApiOperation({ summary: 'Resolve an active war room' })
  resolve(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.resolve(id, user.id)
  }

  @Post(':id/archive')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @ApiOperation({ summary: 'Archive a war room' })
  archive(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.archive(id, user.id)
  }

  // ── Participants ──────────────────────────────────────────────────────────

  @Post(':id/participants')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @ApiOperation({ summary: 'Add participant to war room' })
  addParticipant(@Param('id') id: string, @Body() dto: AddParticipantDto, @CurrentUser() user: RequestUser) {
    return this.service.addParticipant(id, dto, user.id)
  }

  @Delete(':id/participants/:userId')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove participant from war room' })
  removeParticipant(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: RequestUser) {
    return this.service.removeParticipant(id, userId, user.id)
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  @Post(':id/actions')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @ApiOperation({ summary: 'Create an action item' })
  createAction(@Param('id') id: string, @Body() dto: CreateActionDto, @CurrentUser() user: RequestUser) {
    return this.service.createAction(id, dto, user.id)
  }

  @Patch(':id/actions/:actionId')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @ApiOperation({ summary: 'Update an action item' })
  updateAction(
    @Param('id') id: string,
    @Param('actionId') actionId: string,
    @Body() dto: UpdateActionDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.updateAction(id, actionId, dto, user.id)
  }

  // ── Timeline ──────────────────────────────────────────────────────────────

  @Get(':id/timeline')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_VIEW)
  @ApiOperation({ summary: 'Get war room timeline' })
  getTimeline(@Param('id') id: string) {
    return this.service.getTimeline(id)
  }

  @Post(':id/timeline')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @ApiOperation({ summary: 'Add a manual timeline entry' })
  addTimelineEntry(@Param('id') id: string, @Body() dto: AddTimelineEntryDto, @CurrentUser() user: RequestUser) {
    return this.service.addTimelineEntry(id, dto, user.id)
  }

}

// ── Templates controller (separate to avoid :id route conflicts) ──────────────

import { Controller as TemplateController } from '@nestjs/common'

@ApiTags('War Room Templates')
@ApiBearerAuth()
@Controller('war-room-templates')
@UseGuards(JwtAuthGuard)
export class WarRoomTemplatesController {
  constructor(private readonly service: WarRoomsService) {}

  @Get()
  @RequirePermission(PERMISSIONS.WAR_ROOMS_VIEW)
  @ApiOperation({ summary: 'List all war room templates' })
  findAll() { return this.service.findAllTemplates() }

  @Get(':id')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_VIEW)
  @ApiOperation({ summary: 'Get a template by ID' })
  findOne(@Param('id') id: string) { return this.service.findTemplate(id) }

  @Post()
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @ApiOperation({ summary: 'Create a war room template' })
  create(@Body() dto: CreateTemplateDto) { return this.service.createTemplate(dto) }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @ApiOperation({ summary: 'Update a war room template' })
  update(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.service.updateTemplate(id, dto)
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.WAR_ROOMS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a war room template' })
  remove(@Param('id') id: string) { return this.service.deleteTemplate(id) }
}

import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RequirePermission } from '../rbac/decorators/require-permission.decorator'
import { PERMISSIONS } from '../common/constants/permissions.constants'
import { ServiceNowService } from './servicenow.service'
import {
  CreateSnConnectionDto, UpdateSnConnectionDto,
  CreateSnMappingDto, UpdateSnMappingDto,
} from './dto/servicenow.dto'

@ApiTags('ServiceNow')
@ApiBearerAuth()
@Controller('servicenow')
@UseGuards(JwtAuthGuard)
export class ServiceNowController {
  constructor(private readonly service: ServiceNowService) {}

  // ── Connections ───────────────────────────────────────────────────────────

  @Get('connections')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'List ServiceNow connections' })
  findAllConnections() {
    return this.service.findAllConnections()
  }

  @Get('connections/:id')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'Get a ServiceNow connection with mappings' })
  findConnection(@Param('id') id: string) {
    return this.service.findConnection(id)
  }

  @Post('connections')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'Create a ServiceNow connection' })
  createConnection(@Body() dto: CreateSnConnectionDto) {
    return this.service.createConnection(dto)
  }

  @Patch('connections/:id')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'Update a ServiceNow connection' })
  updateConnection(@Param('id') id: string, @Body() dto: UpdateSnConnectionDto) {
    return this.service.updateConnection(id, dto)
  }

  @Delete('connections/:id')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ServiceNow connection' })
  deleteConnection(@Param('id') id: string) {
    return this.service.deleteConnection(id)
  }

  @Post('connections/:id/test')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'Test a ServiceNow connection' })
  testConnection(@Param('id') id: string) {
    return this.service.testConnection(id)
  }

  @Post('connections/:id/sync')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'Trigger a group sync from ServiceNow' })
  syncGroups(@Param('id') id: string) {
    return this.service.syncGroups(id)
  }

  // ── Group Mappings ────────────────────────────────────────────────────────

  @Get('mappings')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'List group mappings, optionally filtered by connection' })
  findMappings(@Query('connectionId') connectionId?: string) {
    return this.service.findMappings(connectionId)
  }

  @Post('mappings')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'Create a group mapping' })
  createMapping(@Body() dto: CreateSnMappingDto) {
    return this.service.createMapping(dto)
  }

  @Patch('mappings/:id')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'Update a group mapping' })
  updateMapping(@Param('id') id: string, @Body() dto: UpdateSnMappingDto) {
    return this.service.updateMapping(id, dto)
  }

  @Delete('mappings/:id')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a group mapping' })
  deleteMapping(@Param('id') id: string) {
    return this.service.deleteMapping(id)
  }

  // ── Sync Logs ─────────────────────────────────────────────────────────────

  @Get('connections/:id/sync-logs')
  @RequirePermission(PERMISSIONS.SERVICENOW_MANAGE)
  @ApiOperation({ summary: 'Get sync logs for a connection' })
  getSyncLogs(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.service.getSyncLogs(id, limit)
  }
}

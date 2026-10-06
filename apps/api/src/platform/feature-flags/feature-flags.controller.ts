import {
  Controller, Get, Post, Patch, Delete, Body,
  Param, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { PlatformGuard, RequirePlatformRole } from '../guards/platform.guard'
import { FeatureFlagsService } from './feature-flags.service'
import { CreateFeatureFlagDto, SetTenantOverrideDto } from '../dto/platform.dto'
import { IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class ToggleDto {
  @ApiProperty()
  @IsBoolean()
  enabled: boolean
}

@ApiTags('Platform — Feature Flags')
@ApiBearerAuth()
@Controller('platform/feature-flags')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class FeatureFlagsController {
  constructor(private readonly service: FeatureFlagsService) {}

  @Get()
  @ApiOperation({ summary: 'List all feature flags with tenant overrides' })
  findAll() { return this.service.findAll() }

  @Get(':id')
  @ApiOperation({ summary: 'Get feature flag detail' })
  findOne(@Param('id') id: string) { return this.service.findOne(id) }

  @Post()
  @RequirePlatformRole('super_admin', 'admin')
  @ApiOperation({ summary: 'Create a feature flag' })
  create(@Body() dto: CreateFeatureFlagDto) { return this.service.create(dto) }

  @Patch(':id/toggle')
  @RequirePlatformRole('super_admin', 'admin')
  @ApiOperation({ summary: 'Toggle flag globally' })
  toggle(@Param('id') id: string, @Body() dto: ToggleDto) {
    return this.service.toggle(id, dto.enabled)
  }

  @Post(':id/overrides')
  @RequirePlatformRole('super_admin', 'admin')
  @ApiOperation({ summary: 'Set per-tenant override' })
  setOverride(@Param('id') id: string, @Body() dto: SetTenantOverrideDto) {
    return this.service.setTenantOverride(id, dto)
  }

  @Delete(':id/overrides/:tenantId')
  @RequirePlatformRole('super_admin', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove per-tenant override' })
  removeOverride(@Param('id') id: string, @Param('tenantId') tenantId: string) {
    return this.service.removeTenantOverride(id, tenantId)
  }
}

import {
  Controller, Get, Post, Delete, Body, Param,
  Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { PlatformGuard, RequirePlatformRole } from '../guards/platform.guard'
import { DomainsService } from './domains.service'
import { AddDomainDto } from '../dto/platform.dto'

@ApiTags('Platform — Domains')
@ApiBearerAuth()
@Controller('platform/domains')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class DomainsController {
  constructor(private readonly service: DomainsService) {}

  @Get()
  @ApiOperation({ summary: 'List domains, optionally filter by tenantId' })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.service.findAll(tenantId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get domain by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id) }

  @Post()
  @RequirePlatformRole('super_admin', 'admin')
  @ApiOperation({ summary: 'Add a domain to a tenant' })
  add(@Body() dto: AddDomainDto) { return this.service.add(dto) }

  @Post(':id/verify')
  @RequirePlatformRole('super_admin', 'admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark domain as verified' })
  verify(@Param('id') id: string) { return this.service.verify(id) }

  @Delete(':id')
  @RequirePlatformRole('super_admin', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove domain' })
  remove(@Param('id') id: string) { return this.service.remove(id) }
}

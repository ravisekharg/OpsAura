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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { PlatformGuard, RequirePlatformRole } from '../guards/platform.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { TenantsService } from './tenants.service'
import { ProvisionTenantDto, UpdateTenantDto } from '../dto/platform.dto'
import type { RequestUser } from '../../common/interfaces/request-user.interface'

@ApiTags('Platform — Tenants')
@ApiBearerAuth()
@Controller('platform/tenants')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'List all tenants' })
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.tenantsService.findAll(search, status)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id)
  }

  @Post()
  @RequirePlatformRole('super_admin', 'admin')
  @ApiOperation({
    summary: 'Provision a new tenant — creates DB, runs migrations, seeds roles, creates admin',
  })
  provision(
    @Body() dto: ProvisionTenantDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tenantsService.provision(dto, user.id, user.email)
  }

  @Patch(':id')
  @RequirePlatformRole('super_admin', 'admin')
  @ApiOperation({ summary: 'Update tenant name, status or plan' })
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(id, dto)
  }

  @Post(':id/suspend')
  @RequirePlatformRole('super_admin', 'admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suspend a tenant' })
  suspend(@Param('id') id: string) {
    return this.tenantsService.suspend(id)
  }
}

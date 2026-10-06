import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { PlatformGuard, RequirePlatformRole } from '../guards/platform.guard'
import { PlansService } from './plans.service'
import { CreatePlanDto, UpdatePlanDto } from '../dto/platform.dto'

@ApiTags('Platform — Plans')
@ApiBearerAuth()
@Controller('platform/plans')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'List all plans' })
  findAll() { return this.plansService.findAll() }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan by ID' })
  findOne(@Param('id') id: string) { return this.plansService.findOne(id) }

  @Post()
  @RequirePlatformRole('super_admin', 'admin')
  @ApiOperation({ summary: 'Create a plan' })
  create(@Body() dto: CreatePlanDto) { return this.plansService.create(dto) }

  @Patch(':id')
  @RequirePlatformRole('super_admin', 'admin')
  @ApiOperation({ summary: 'Update plan features/limits/price' })
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(id, dto)
  }
}

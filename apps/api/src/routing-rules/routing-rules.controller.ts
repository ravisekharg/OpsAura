import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RequirePermission } from '../rbac/decorators/require-permission.decorator'
import { PERMISSIONS } from '../common/constants/permissions.constants'
import { RoutingRulesService } from './routing-rules.service'
import { CreateRoutingRuleDto, UpdateRoutingRuleDto, ReorderRoutingRulesDto } from './dto/routing-rule.dto'

@ApiTags('Routing Rules')
@ApiBearerAuth()
@Controller('routing-rules')
@UseGuards(JwtAuthGuard)
export class RoutingRulesController {
  constructor(private readonly service: RoutingRulesService) {}

  @Get()
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'List routing rules, optionally filtered by assignment group' })
  findAll(@Query('assignmentGroupId') assignmentGroupId?: string) {
    return this.service.findAll(assignmentGroupId)
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Get a routing rule by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Create a routing rule' })
  create(@Body() dto: CreateRoutingRuleDto) {
    return this.service.create(dto)
  }

  @Patch('reorder')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Bulk reorder routing rules by priority' })
  reorder(@Body() dto: ReorderRoutingRulesDto) {
    return this.service.reorder(dto)
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Update a routing rule' })
  update(@Param('id') id: string, @Body() dto: UpdateRoutingRuleDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a routing rule' })
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }

  @Post('test')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Test which routing rule matches a given alert payload' })
  test(@Body() payload: Record<string, any>) {
    return this.service.testRule(payload)
  }
}

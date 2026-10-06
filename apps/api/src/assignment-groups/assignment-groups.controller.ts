import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { AssignmentGroupsService } from './assignment-groups.service'
import {
  CreateAssignmentGroupDto,
  UpdateAssignmentGroupDto,
  CreateRoutingRuleDto,
  UpdateRoutingRuleDto,
  ReorderRuleDto,
} from './dto/assignment-group.dto'

@ApiTags('Assignment Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assignment-groups')
export class AssignmentGroupsController {
  constructor(private readonly service: AssignmentGroupsService) {}

  @Get()
  @RequirePermission(PERMISSIONS.TEAMS_VIEW)
  @ApiOperation({ summary: 'List assignment groups' })
  findAll(@Query('search') search?: string) {
    return this.service.findAllGroups(search)
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.TEAMS_VIEW)
  @ApiOperation({ summary: 'Get assignment group by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOneGroup(id)
  }

  @Post()
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Create assignment group' })
  create(@Body() dto: CreateAssignmentGroupDto) {
    return this.service.createGroup(dto)
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Update assignment group' })
  update(@Param('id') id: string, @Body() dto: UpdateAssignmentGroupDto) {
    return this.service.updateGroup(id, dto)
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete assignment group' })
  remove(@Param('id') id: string) {
    return this.service.removeGroup(id)
  }
}

@ApiTags('Routing Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('routing-rules')
export class RoutingRulesController {
  constructor(private readonly service: AssignmentGroupsService) {}

  @Get()
  @RequirePermission(PERMISSIONS.ALERTS_VIEW)
  @ApiOperation({ summary: 'List routing rules ordered by priority' })
  findAll() {
    return this.service.findAllRules()
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.ALERTS_VIEW)
  @ApiOperation({ summary: 'Get routing rule by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOneRule(id)
  }

  @Post()
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Create routing rule' })
  create(@Body() dto: CreateRoutingRuleDto) {
    return this.service.createRule(dto)
  }

  @Patch('reorder')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Reorder routing rules by priority' })
  reorder(@Body() rules: ReorderRuleDto[]) {
    return this.service.reorderRules(rules)
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @ApiOperation({ summary: 'Update routing rule' })
  update(@Param('id') id: string, @Body() dto: UpdateRoutingRuleDto) {
    return this.service.updateRule(id, dto)
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.ALERTS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete routing rule' })
  remove(@Param('id') id: string) {
    return this.service.removeRule(id)
  }
}

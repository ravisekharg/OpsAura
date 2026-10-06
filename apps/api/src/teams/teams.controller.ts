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
import { TeamsService } from './teams.service'
import { CreateTeamDto, UpdateTeamDto, AddMemberDto } from './dto/team.dto'

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @RequirePermission(PERMISSIONS.TEAMS_VIEW)
  @ApiOperation({ summary: 'List all teams' })
  findAll(@Query('search') search?: string) {
    return this.teamsService.findAll(search)
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.TEAMS_VIEW)
  @ApiOperation({ summary: 'Get team by ID with members' })
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id)
  }

  @Post()
  @RequirePermission(PERMISSIONS.TEAMS_MANAGE)
  @ApiOperation({ summary: 'Create a new team' })
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto)
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.TEAMS_MANAGE)
  @ApiOperation({ summary: 'Update team details' })
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.TEAMS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a team' })
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id)
  }

  @Post(':id/members')
  @RequirePermission(PERMISSIONS.TEAMS_MANAGE)
  @ApiOperation({ summary: 'Add a user to team' })
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.teamsService.addMember(id, dto)
  }

  @Delete(':id/members/:userId')
  @RequirePermission(PERMISSIONS.TEAMS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a user from team' })
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.teamsService.removeMember(id, userId)
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
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
import { ServicesService } from './services.service'
import { CreateServiceDto, UpdateServiceDto, SetOwnershipDto } from './dto/service.dto'

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @RequirePermission(PERMISSIONS.SERVICES_VIEW)
  @ApiOperation({ summary: 'List all services' })
  findAll(@Query('search') search?: string) {
    return this.servicesService.findAll(search)
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.SERVICES_VIEW)
  @ApiOperation({ summary: 'Get service by ID with ownership' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id)
  }

  @Post()
  @RequirePermission(PERMISSIONS.SERVICES_MANAGE)
  @ApiOperation({ summary: 'Create a new service' })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto)
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.SERVICES_MANAGE)
  @ApiOperation({ summary: 'Update service details' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.SERVICES_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a service' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id)
  }

  @Get(':id/ownership')
  @RequirePermission(PERMISSIONS.SERVICES_VIEW)
  @ApiOperation({ summary: 'Get service ownership record' })
  getOwnership(@Param('id') id: string) {
    return this.servicesService.getOwnership(id)
  }

  @Put(':id/ownership')
  @RequirePermission(PERMISSIONS.SERVICES_MANAGE)
  @ApiOperation({ summary: 'Set or update service ownership' })
  setOwnership(@Param('id') id: string, @Body() dto: SetOwnershipDto) {
    return this.servicesService.setOwnership(id, dto)
  }
}

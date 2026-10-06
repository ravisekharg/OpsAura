import {
  Controller, Get, Post, Delete, Body, Param,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiHeader } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ApiKeysService } from './api-keys.service'
import { CreateApiKeyDto } from './dto/api-key.dto'
import type { RequestUser } from '../common/interfaces/request-user.interface'

@ApiTags('API Keys')
@ApiBearerAuth()
@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly service: ApiKeysService) {}

  @Get()
  @ApiOperation({ summary: 'List your API keys (secrets never returned)' })
  findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create an API key — secret shown ONCE in response' })
  create(@Body() dto: CreateApiKeyDto, @CurrentUser() user: RequestUser) {
    return this.service.create(user.id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke an API key' })
  revoke(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.revoke(id, user.id)
  }
}

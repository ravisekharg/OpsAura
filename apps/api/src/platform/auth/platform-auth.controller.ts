import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Request } from 'express'
import { Throttle } from '@nestjs/throttler'
import { Public } from '../../common/decorators/public.decorator'
import { PlatformAuthService } from './platform-auth.service'
import { PlatformLoginDto } from '../dto/platform.dto'

@ApiTags('Platform Auth')
@Controller('platform/auth')
export class PlatformAuthController {
  constructor(private readonly authService: PlatformAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Platform admin login' })
  login(@Body() dto: PlatformLoginDto, @Req() req: Request) {
    return this.authService.login(
      dto,
      req.ip ?? '',
      req.headers['user-agent'] ?? '',
    )
  }
}

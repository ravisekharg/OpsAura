import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { Public } from '../common/decorators/public.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { LoginDto, MfaVerifyDto } from './dto/login.dto'
import {
  RequestPasswordResetDto,
  ConfirmPasswordResetDto,
} from './dto/reset-password.dto'
import { ForceChangePasswordDto } from './dto/force-change.dto'
import { MfaEnrollConfirmDto, MfaDisableDto } from './dto/mfa.dto'
import type { RequestUser } from '../common/interfaces/request-user.interface'

const REFRESH_COOKIE = 'opsaura-refresh'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/v1/auth',
}

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email + password' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip ?? ''
    const ua = req.headers['user-agent'] ?? ''
    const result = await this.authService.login(dto, ip, ua)

    if (!result.mfaRequired && 'refreshToken' in result) {
      res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS)
      const { refreshToken, ...safe } = result
      return safe
    }

    return result
  }

  @Public()
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Complete login with MFA TOTP code' })
  async verifyMfa(
    @Body() dto: MfaVerifyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyMfa(
      dto.mfaToken,
      dto.code,
      req.ip ?? '',
      req.headers['user-agent'] ?? '',
    )

    res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS)
    const { refreshToken, ...safe } = result
    return safe
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE]
    if (!refreshToken) {
      return { error: 'No refresh token' }
    }

    // Tenant slug comes from the (unverified) cookie or a header
    const tenantSlug =
      (req.headers['x-tenant-slug'] as string) ?? 'unknown'

    const result = await this.authService.refreshTokens(
      refreshToken,
      tenantSlug,
      req.ip ?? '',
      req.headers['user-agent'] ?? '',
    )

    res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS)
    return { accessToken: result.accessToken }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: RequestUser,
  ) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE]
    if (refreshToken) {
      await this.authService.logout(refreshToken, user.tenantSlug)
    }
    res.clearCookie(REFRESH_COOKIE, { path: '/v1/auth' })
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @ApiOperation({ summary: 'Request a password reset email' })
  async requestReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto)
  }

  @Public()
  @Post('reset-password/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm password reset with token' })
  async confirmReset(
    @Body() dto: ConfirmPasswordResetDto,
    @Req() req: Request,
  ) {
    const tenantSlug = req.headers['x-tenant-slug'] as string
    return this.authService.confirmPasswordReset(dto, tenantSlug)
  }

  @Post('change-password-forced')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change temporary password — must be called when requiresPasswordChange=true' })
  async forceChangePassword(
    @Body() dto: ForceChangePasswordDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.authService.forceChangePassword(user.id, user.tenantSlug, dto)
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: RequestUser) {
    return user
  }

  // ── MFA Enrollment ────────────────────────────────────────────────────────

  @Get('mfa/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get MFA status for current user' })
  mfaStatus(@CurrentUser() user: RequestUser) {
    return this.authService.mfaStatus(user.id, user.tenantSlug)
  }

  @Post('mfa/enroll')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Begin MFA enrollment — returns QR code and secret' })
  mfaEnroll(@CurrentUser() user: RequestUser) {
    return this.authService.mfaEnroll(user.id, user.tenantSlug)
  }

  @Post('mfa/enable')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm MFA enrollment with TOTP code — returns backup codes' })
  mfaEnable(@Body() dto: MfaEnrollConfirmDto, @CurrentUser() user: RequestUser) {
    return this.authService.mfaEnable(user.id, user.tenantSlug, dto.code)
  }

  @Post('mfa/disable')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Disable MFA by verifying current TOTP code' })
  mfaDisable(@Body() dto: MfaDisableDto, @CurrentUser() user: RequestUser) {
    return this.authService.mfaDisable(user.id, user.tenantSlug, dto.code)
  }
}

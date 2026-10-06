import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { JwtPayload, RequestUser } from '../../common/interfaces/request-user.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
    })
  }

  async validate(payload: JwtPayload & { requiresPasswordChange?: boolean }): Promise<RequestUser> {
    if (!payload.sub || !payload.tenantSlug) {
      throw new UnauthorizedException('Invalid token payload')
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      tenantSlug: payload.tenantSlug,
      role: payload.role,
      permissions: payload.permissions ?? [],
      requiresPasswordChange: payload.requiresPasswordChange ?? false,
    }
  }
}

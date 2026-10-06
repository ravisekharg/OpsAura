import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { API_KEY_STRATEGY } from '../strategies/api-key.strategy'

/**
 * Accepts either a Bearer JWT **or** an x-api-key header.
 * Use on routes that should be accessible from both browser sessions and API integrations.
 */
@Injectable()
export class ApiKeyOrJwtGuard extends AuthGuard([API_KEY_STRATEGY, 'jwt']) {
  handleRequest<TUser = any>(err: any, user: TUser): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required — provide Bearer token or x-api-key')
    }
    return user
  }
}

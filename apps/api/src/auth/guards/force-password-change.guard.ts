import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator'

// Routes exempt from the force-password-change block
const EXEMPT_PATHS = [
  '/v1/auth/change-password-forced',
  '/v1/auth/logout',
  '/v1/auth/me',
]

@Injectable()
export class ForcePasswordChangeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) return true // JwtAuthGuard will handle this

    if (!user.requiresPasswordChange) return true

    const path = request.path as string
    if (EXEMPT_PATHS.some((p) => path.startsWith(p))) return true

    throw new ForbiddenException({
      code: 'PASSWORD_CHANGE_REQUIRED',
      message: 'You must change your temporary password before continuing.',
      action: 'POST /v1/auth/change-password-forced',
    })
  }
}

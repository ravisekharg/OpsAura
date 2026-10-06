import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from './decorators/require-permission.decorator'
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator'
import type { RequestUser } from '../common/interfaces/request-user.interface'

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )

    // No permission decorator on this route — allow any authenticated user
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: RequestUser = request.user

    if (!user) {
      throw new ForbiddenException('Not authenticated')
    }

    const hasAll = requiredPermissions.every((p) =>
      user.permissions.includes(p),
    )

    if (!hasAll) {
      const missing = requiredPermissions.filter(
        (p) => !user.permissions.includes(p),
      )
      throw new ForbiddenException(
        `Insufficient permissions. Missing: ${missing.join(', ')}`,
      )
    }

    return true
  }
}

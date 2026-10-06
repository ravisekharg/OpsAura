import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator'

export const PLATFORM_ROLES = [
  'super_admin',
  'admin',
  'support_admin',
  'billing_admin',
  'read_only',
] as const

export type PlatformRole = (typeof PLATFORM_ROLES)[number]

export const PLATFORM_ROLE_KEY = 'requiredPlatformRoles'

export const RequirePlatformRole = (...roles: PlatformRole[]) =>
  Reflect.metadata(PLATFORM_ROLE_KEY, roles)

@Injectable()
export class PlatformGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) throw new ForbiddenException('Not authenticated')

    // Platform routes require tenantSlug === "platform"
    if (user.tenantSlug !== 'platform') {
      throw new ForbiddenException('Platform access required')
    }

    const required = this.reflector.getAllAndOverride<PlatformRole[]>(
      PLATFORM_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!required || required.length === 0) return true

    if (!required.includes(user.role as PlatformRole)) {
      throw new ForbiddenException(
        `Required platform role: ${required.join(' or ')}`,
      )
    }

    return true
  }
}

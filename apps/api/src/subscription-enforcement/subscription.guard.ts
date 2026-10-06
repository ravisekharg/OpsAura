import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator'
import { PlatformPrismaService } from '../database/platform-prisma.service'
import Redis from 'ioredis'

const CACHE_TTL_SECONDS = 300 // 5 minutes
const READONLY_METHODS = ['GET', 'HEAD', 'OPTIONS']

@Injectable()
export class SubscriptionGuard implements CanActivate {
  private readonly logger = new Logger(SubscriptionGuard.name)
  private readonly redis: Redis

  constructor(
    private readonly reflector: Reflector,
    private readonly platformDb: PlatformPrismaService,
    private readonly config: ConfigService,
  ) {
    this.redis = new Redis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      password: config.get('REDIS_PASSWORD') || undefined,
      keyPrefix: 'sub:',
      lazyConnect: true,
    })
    this.redis.on("error", () => {})
    this.redis.connect().catch(() => {
      this.logger.warn('Redis not available — subscription cache degraded')
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) return true // JwtAuthGuard handles this
    if (user.tenantSlug === 'platform') return true // Platform admins bypass

    const status = await this.getSubscriptionStatus(user.tenantSlug)

    if (status === 'CANCELLED') {
      throw new ForbiddenException({
        code: 'SUBSCRIPTION_CANCELLED',
        message: 'Your subscription has been cancelled. Please contact billing to reactivate.',
      })
    }

    if (status === 'PAST_DUE') {
      // Allow read-only access only
      if (!READONLY_METHODS.includes(request.method)) {
        throw new ForbiddenException({
          code: 'SUBSCRIPTION_PAST_DUE',
          message: 'Your subscription payment is overdue. Write access is suspended until payment is resolved.',
        })
      }
    }

    // Attach subscription status to request for downstream use
    request.subscriptionStatus = status
    return true
  }

  private async getSubscriptionStatus(tenantSlug: string): Promise<string | null> {
    const cacheKey = tenantSlug

    // Try cache first
    const cached = await this.redis.get(cacheKey).catch(() => null)
    if (cached) return cached

    // Fallback: query platform DB
    const tenant = await this.platformDb.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true, status: true },
    })

    if (!tenant) return 'CANCELLED'

    // If tenant is suspended/cancelled, no need to check subscription
    if (tenant.status === 'SUSPENDED' || tenant.status === 'CANCELLED') {
      await this.redis.set(cacheKey, 'CANCELLED', 'EX', CACHE_TTL_SECONDS).catch(() => null)
      return 'CANCELLED'
    }

    const subscription = await this.platformDb.subscription.findFirst({
      where: { tenantId: tenant.id },
      orderBy: { startsAt: 'desc' },
      select: { status: true },
    })

    const status = subscription?.status ?? 'TRIALING'
    await this.redis.set(cacheKey, status, 'EX', CACHE_TTL_SECONDS).catch(() => null)
    return status
  }
}

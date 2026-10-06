import { Injectable, ForbiddenException, Logger } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import { PlatformPrismaService } from '../database/platform-prisma.service'

export type LimitedResource = 'users' | 'services' | 'schedules' | 'teams'

@Injectable()
export class PlanLimitsService {
  private readonly logger = new Logger(PlanLimitsService.name)

  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly platformDb: PlatformPrismaService,
  ) {}

  async enforceLimit(resource: LimitedResource, tenantSlug: string): Promise<void> {
    const tenant = await this.platformDb.tenant.findUnique({
      where: { slug: tenantSlug },
      include: { plan: true },
    })

    if (!tenant?.plan) {
      this.logger.warn(`No plan found for tenant ${tenantSlug} — skipping limit check`)
      return
    }

    const limits = tenant.plan.limits as Record<string, number>
    const limit = limits?.[resource]

    if (!limit || limit <= 0) return // no limit set for this resource on this plan

    const db = this.tenantContext.getDb()
    const current = await this.countResource(db, resource)

    if (current >= limit) {
      throw new ForbiddenException({
        code: 'PLAN_LIMIT_REACHED',
        message: `Your plan allows a maximum of ${limit} ${resource}. You have ${current}. Please upgrade your plan.`,
        resource,
        current,
        limit,
        upgradeUrl: 'https://opsaura.io/billing',
      })
    }
  }

  private async countResource(db: ReturnType<TenantContextService['getDb']>, resource: LimitedResource): Promise<number> {
    switch (resource) {
      case 'users':
        return db.user.count({ where: { status: { in: ['ACTIVE', 'INVITED'] } } })
      case 'services':
        return db.service.count({ where: { status: 'ACTIVE' } })
      case 'schedules':
        return db.schedule.count({ where: { active: true } })
      case 'teams':
        return db.team.count()
      default:
        return 0
    }
  }
}

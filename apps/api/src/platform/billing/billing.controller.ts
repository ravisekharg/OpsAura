import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { PlatformGuard } from '../guards/platform.guard'
import { PlatformPrismaService } from '../../database/platform-prisma.service'

@ApiTags('Platform — Billing')
@ApiBearerAuth()
@Controller('platform/billing')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class BillingController {
  constructor(private readonly platformDb: PlatformPrismaService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Billing overview — active tenants, MRR, subscription statuses' })
  async overview() {
    const [tenants, subscriptions, plans] = await Promise.all([
      this.platformDb.tenant.count({ where: { status: 'ACTIVE' } }),
      this.platformDb.subscription.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.platformDb.plan.findMany({
        include: { _count: { select: { tenants: true } } },
      }),
    ])

    const activeSubscriptions = subscriptions.find((s) => s.status === 'ACTIVE')?._count._all ?? 0
    const trialingSubscriptions = subscriptions.find((s) => s.status === 'TRIALING')?._count._all ?? 0

    // MRR = sum of active subscription plan prices
    const activeSubs = await this.platformDb.subscription.findMany({
      where: { status: { in: ['ACTIVE', 'TRIALING'] } },
      include: { plan: { select: { priceMonthly: true } } },
    })

    const mrr = activeSubs.reduce((sum, s) => {
      const price = Number(s.plan.priceMonthly ?? 0)
      return sum + (s.billingCycle === 'ANNUAL' ? price : price)
    }, 0)

    return {
      activeTenants: tenants,
      activeSubscriptions,
      trialingSubscriptions,
      mrr,
      plans: plans.map((p) => ({
        id: p.id,
        name: p.name,
        tenantCount: p._count.tenants,
        priceMonthly: p.priceMonthly,
      })),
      subscriptionBreakdown: subscriptions.map((s) => ({
        status: s.status,
        count: s._count._all,
      })),
    }
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'All subscriptions with tenant and plan detail' })
  async allSubscriptions(@Query('status') status?: string) {
    return this.platformDb.subscription.findMany({
      where: status ? { status: status as any } : {},
      include: {
        tenant: { select: { id: true, slug: true, name: true } },
        plan: { select: { id: true, name: true, priceMonthly: true } },
      },
      orderBy: { startsAt: 'desc' },
    })
  }
}

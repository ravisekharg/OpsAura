import { Injectable } from '@nestjs/common'
import { PlatformPrismaService } from '../../database/platform-prisma.service'
import type { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/platform.dto'

@Injectable()
export class SubscriptionsRepository {
  constructor(private readonly db: PlatformPrismaService) {}

  private readonly include = {
    tenant: { select: { id: true, slug: true, name: true } },
    plan: { select: { id: true, name: true, priceMonthly: true } },
  }

  findAll(tenantId?: string) {
    return this.db.subscription.findMany({
      where: tenantId ? { tenantId } : {},
      include: this.include,
      orderBy: { startsAt: 'desc' },
    })
  }

  findById(id: string) {
    return this.db.subscription.findUnique({ where: { id }, include: this.include })
  }

  findActiveByTenant(tenantId: string) {
    return this.db.subscription.findFirst({
      where: { tenantId, status: { in: ['ACTIVE', 'TRIALING'] } },
      include: this.include,
      orderBy: { startsAt: 'desc' },
    })
  }

  create(data: CreateSubscriptionDto) {
    return this.db.subscription.create({
      data: {
        tenantId: data.tenantId,
        planId: data.planId,
        status: 'TRIALING',
        billingCycle: (data.billingCycle ?? 'MONTHLY') as any,
        startsAt: new Date(),
      },
      include: this.include,
    })
  }

  update(id: string, data: UpdateSubscriptionDto) {
    return this.db.subscription.update({
      where: { id },
      data: {
        status: data.status as any,
        planId: data.planId,
        billingCycle: data.billingCycle as any,
      },
      include: this.include,
    })
  }

  cancel(id: string) {
    return this.db.subscription.update({
      where: { id },
      data: { status: 'CANCELLED', endsAt: new Date() },
      include: this.include,
    })
  }
}

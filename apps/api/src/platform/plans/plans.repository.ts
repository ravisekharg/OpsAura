import { Injectable } from '@nestjs/common'
import { PlatformPrismaService } from '../../database/platform-prisma.service'
import type { CreatePlanDto, UpdatePlanDto } from '../dto/platform.dto'

@Injectable()
export class PlansRepository {
  constructor(private readonly db: PlatformPrismaService) {}

  findAll() {
    return this.db.plan.findMany({
      include: { _count: { select: { tenants: true, subscriptions: true } } },
      orderBy: { name: 'asc' },
    })
  }

  findById(id: string) {
    return this.db.plan.findUnique({
      where: { id },
      include: { _count: { select: { tenants: true, subscriptions: true } } },
    })
  }

  create(data: CreatePlanDto) {
    return this.db.plan.create({
      data: {
        name: data.name,
        features: (data.features ?? {}) as any,
        limits: (data.limits ?? {}) as any,
        priceMonthly: data.priceMonthly ?? 0,
      },
    })
  }

  update(id: string, data: UpdatePlanDto) {
    return this.db.plan.update({
      where: { id },
      data: {
        name: data.name,
        features: data.features as any,
        limits: data.limits as any,
        priceMonthly: data.priceMonthly,
      },
    })
  }
}

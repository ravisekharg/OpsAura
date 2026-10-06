import { Injectable } from '@nestjs/common'
import { PlatformPrismaService } from '../../database/platform-prisma.service'

@Injectable()
export class TenantsRepository {
  constructor(private readonly db: PlatformPrismaService) {}

  private readonly include = {
    plan: { select: { id: true, name: true } },
    subscriptions: {
      select: { id: true, status: true, billingCycle: true, startsAt: true, endsAt: true },
      orderBy: { startsAt: 'desc' as const },
      take: 1,
    },
    _count: { select: { subscriptions: true } },
  }

  async findMany(search?: string, status?: string) {
    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status) where.status = status

    return this.db.tenant.findMany({
      where,
      include: this.include,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return this.db.tenant.findUnique({ where: { id }, include: this.include })
  }

  async findBySlug(slug: string) {
    return this.db.tenant.findUnique({ where: { slug }, include: this.include })
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.db.tenant.update({
      where: { id },
      data: data as any,
      include: this.include,
    })
  }

  async suspend(id: string) {
    return this.db.tenant.update({
      where: { id },
      data: { status: 'SUSPENDED', suspendedAt: new Date() },
      include: this.include,
    })
  }
}

import { Injectable } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import type { CreateServiceDto, UpdateServiceDto, SetOwnershipDto } from './dto/service.dto'

@Injectable()
export class ServicesRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() {
    return this.tenantContext.getDb()
  }

  private readonly include = {
    team: { select: { id: true, name: true } },
    ownership: {
      include: {
        primaryUser: { select: { id: true, name: true, email: true } },
        secondaryUser: { select: { id: true, name: true, email: true } },
        assignmentGroup: { select: { id: true, name: true } },
      },
    },
  }

  async findMany(search?: string) {
    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {}

    return this.db.service.findMany({
      where,
      include: this.include,
      orderBy: [{ tier: 'asc' }, { name: 'asc' }],
    })
  }

  async findById(id: string) {
    return this.db.service.findUnique({ where: { id }, include: this.include })
  }

  async create(data: CreateServiceDto) {
    return this.db.service.create({
      data: {
        name: data.name,
        description: data.description,
        teamId: data.teamId ?? null,
        tier: data.tier ?? 'P2',
        status: data.status ?? 'ACTIVE',
      },
      include: this.include,
    })
  }

  async update(id: string, data: UpdateServiceDto) {
    return this.db.service.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        teamId: data.teamId,
        tier: data.tier,
        status: data.status,
      },
      include: this.include,
    })
  }

  async delete(id: string) {
    return this.db.service.delete({ where: { id } })
  }

  async getOwnership(serviceId: string) {
    return this.db.serviceOwnership.findUnique({
      where: { serviceId },
      include: {
        primaryUser: { select: { id: true, name: true, email: true } },
        secondaryUser: { select: { id: true, name: true, email: true } },
        assignmentGroup: { select: { id: true, name: true } },
      },
    })
  }

  async upsertOwnership(serviceId: string, data: SetOwnershipDto) {
    return this.db.serviceOwnership.upsert({
      where: { serviceId },
      create: {
        serviceId,
        primaryUserId: data.primaryUserId ?? null,
        secondaryUserId: data.secondaryUserId ?? null,
        assignmentGroupId: data.assignmentGroupId ?? null,
      },
      update: {
        primaryUserId: data.primaryUserId,
        secondaryUserId: data.secondaryUserId,
        assignmentGroupId: data.assignmentGroupId,
      },
      include: {
        primaryUser: { select: { id: true, name: true, email: true } },
        secondaryUser: { select: { id: true, name: true, email: true } },
        assignmentGroup: { select: { id: true, name: true } },
      },
    })
  }
}

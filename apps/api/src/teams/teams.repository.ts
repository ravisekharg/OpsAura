import { Injectable } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import type { CreateTeamDto, UpdateTeamDto } from './dto/team.dto'

@Injectable()
export class TeamsRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() {
    return this.tenantContext.getDb()
  }

  async findMany(search?: string) {
    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {}

    return this.db.team.findMany({
      where,
      include: {
        lead: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { members: true, services: true } },
      },
      orderBy: { name: 'asc' },
    })
  }

  async findById(id: string) {
    return this.db.team.findUnique({
      where: { id },
      include: {
        lead: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { members: true, services: true } },
      },
    })
  }

  async create(data: CreateTeamDto) {
    return this.db.team.create({
      data: {
        name: data.name,
        description: data.description,
        leadUserId: data.leadUserId ?? null,
      },
      include: {
        lead: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true } },
      },
    })
  }

  async update(id: string, data: UpdateTeamDto) {
    return this.db.team.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        leadUserId: data.leadUserId,
      },
      include: {
        lead: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true } },
      },
    })
  }

  async delete(id: string) {
    return this.db.team.delete({ where: { id } })
  }

  async addMember(teamId: string, userId: string) {
    return this.db.teamMember.create({
      data: { teamId, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
  }

  async removeMember(teamId: string, userId: string) {
    return this.db.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    })
  }

  async isMember(teamId: string, userId: string): Promise<boolean> {
    const m = await this.db.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    })
    return !!m
  }
}

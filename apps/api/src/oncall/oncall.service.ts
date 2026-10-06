import { Injectable, NotFoundException } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import { OnCallResolverService } from '../alerts/routing/oncall-resolver.service'
import type {
  CreateScheduleDto, UpdateScheduleDto,
  CreateRotationDto, UpdateRotationDto,
  CreateOverrideDto,
} from './dto/oncall.dto'

@Injectable()
export class OnCallService {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly resolver: OnCallResolverService,
  ) {}

  private get db() { return this.tenantContext.getDb() }

  // ── Schedules ─────────────────────────────────────────────────────────────

  getSchedules() {
    return this.db.schedule.findMany({
      include: {
        team: { select: { id: true, name: true } },
        _count: { select: { rotations: true, overrides: true } },
      },
      orderBy: { name: 'asc' },
    })
  }

  async getSchedule(id: string) {
    const schedule = await this.db.schedule.findUnique({
      where: { id },
      include: {
        team: { select: { id: true, name: true } },
        rotations: { where: { active: true } },
        _count: { select: { overrides: true } },
      },
    })
    if (!schedule) throw new NotFoundException(`Schedule ${id} not found`)
    return schedule
  }

  createSchedule(dto: CreateScheduleDto) {
    return this.db.schedule.create({
      data: {
        name: dto.name,
        description: dto.description,
        teamId: dto.teamId ?? null,
        timezone: dto.timezone,
        active: true,
      },
      include: { team: { select: { id: true, name: true } } },
    })
  }

  async updateSchedule(id: string, dto: UpdateScheduleDto) {
    await this.getSchedule(id)
    return this.db.schedule.update({
      where: { id },
      data: dto as any,
      include: { team: { select: { id: true, name: true } } },
    })
  }

  async deleteSchedule(id: string) {
    await this.getSchedule(id)
    return this.db.schedule.update({ where: { id }, data: { active: false } })
  }

  // ── Rotations ─────────────────────────────────────────────────────────────

  getRotations(scheduleId?: string) {
    return this.db.rotation.findMany({
      where: scheduleId ? { scheduleId } : {},
      include: { schedule: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  createRotation(dto: CreateRotationDto) {
    return this.db.rotation.create({
      data: {
        scheduleId: dto.scheduleId,
        name: dto.name,
        type: dto.type as any,
        members: dto.members as any,
        handoffDay: dto.handoffDay ?? null,
        handoffTime: dto.handoffTime ? new Date(`1970-01-01T${dto.handoffTime}:00Z`) : null,
        active: true,
      },
      include: { schedule: { select: { id: true, name: true } } },
    })
  }

  updateRotation(id: string, dto: UpdateRotationDto) {
    return this.db.rotation.update({ where: { id }, data: dto as any })
  }

  deleteRotation(id: string) {
    return this.db.rotation.update({ where: { id }, data: { active: false } })
  }

  // ── Overrides ─────────────────────────────────────────────────────────────

  getOverrides(scheduleId?: string) {
    return this.db.override.findMany({
      where: scheduleId ? { scheduleId } : {},
      include: {
        schedule: { select: { id: true, name: true } },
        originalUser: { select: { id: true, name: true } },
        overrideUser: { select: { id: true, name: true } },
      },
      orderBy: { startAt: 'asc' },
    })
  }

  createOverride(dto: CreateOverrideDto, createdBy: string) {
    return this.db.override.create({
      data: {
        scheduleId: dto.scheduleId,
        originalUserId: dto.originalUserId,
        overrideUserId: dto.overrideUserId,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        reason: dto.reason,
        createdBy,
      },
      include: {
        originalUser: { select: { id: true, name: true } },
        overrideUser: { select: { id: true, name: true } },
      },
    })
  }

  deleteOverride(id: string) {
    return this.db.override.delete({ where: { id } })
  }

  // ── Who is on-call ────────────────────────────────────────────────────────

  async currentOnCall(assignmentGroupId?: string) {
    if (assignmentGroupId) return this.resolver.resolveOnCall(assignmentGroupId)
    const groups = await this.db.assignmentGroup.findMany({
      where: { active: true },
      select: { id: true, name: true },
    })
    return Promise.all(groups.map(async (g) => ({
      group: g,
      oncall: await this.resolver.resolveOnCall(g.id),
    })))
  }

  async coverage(weekStart?: string) {
    const start = weekStart ? new Date(weekStart) : this.getWeekStart(new Date())
    const end = new Date(start.getTime() + 7 * 86400000)
    const schedules = await this.db.schedule.findMany({
      where: { active: true },
      include: {
        rotations: { where: { active: true } },
        overrides: {
          where: { startAt: { lte: end }, endAt: { gte: start } },
          include: {
            overrideUser: { select: { id: true, name: true } },
            originalUser: { select: { id: true, name: true } },
          },
        },
      },
    })
    return { weekStart: start.toISOString(), schedules }
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
    d.setHours(0, 0, 0, 0)
    return d
  }
}

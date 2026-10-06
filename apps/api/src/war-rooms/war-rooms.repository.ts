import { Injectable } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import type {
  CreateWarRoomDto, UpdateWarRoomDto, AddParticipantDto,
  CreateActionDto, UpdateActionDto, AddTimelineEntryDto,
  CreateTemplateDto, UpdateTemplateDto,
} from './dto/war-room.dto'

const WAR_ROOM_INCLUDE = {
  service: { select: { id: true, name: true, tier: true } },
  incidentCommander: { select: { id: true, name: true, email: true } },
  participants: {
    where: { leftAt: null },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { joinedAt: 'asc' as const },
  },
  actions: {
    include: { assignedUser: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' as const },
  },
  template: { select: { id: true, name: true } },
  _count: { select: { participants: true, actions: true, timeline: true } },
}

@Injectable()
export class WarRoomsRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() { return this.tenantContext.getDb() }

  findMany(status?: string) {
    return this.db.warRoom.findMany({
      where: status ? { status: status as any } : {},
      include: {
        service: { select: { id: true, name: true } },
        incidentCommander: { select: { id: true, name: true } },
        _count: { select: { participants: true, actions: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  findById(id: string) {
    return this.db.warRoom.findUnique({ where: { id }, include: WAR_ROOM_INCLUDE })
  }

  create(dto: CreateWarRoomDto, commanderId: string) {
    return this.db.warRoom.create({
      data: {
        title: dto.title,
        description: dto.description,
        severity: dto.severity as any,
        serviceId: dto.serviceId ?? null,
        alertIds: dto.alertIds ?? [],
        templateId: dto.templateId ?? null,
        incidentCommanderId: commanderId,
      },
      include: WAR_ROOM_INCLUDE,
    })
  }

  update(id: string, dto: UpdateWarRoomDto) {
    return this.db.warRoom.update({ where: { id }, data: dto as any, include: WAR_ROOM_INCLUDE })
  }

  resolve(id: string) {
    return this.db.warRoom.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
      include: WAR_ROOM_INCLUDE,
    })
  }

  archive(id: string) {
    return this.db.warRoom.update({
      where: { id },
      data: { status: 'ARCHIVED' },
      include: WAR_ROOM_INCLUDE,
    })
  }

  // Participants
  findParticipant(warRoomId: string, userId: string) {
    return this.db.warRoomParticipant.findFirst({ where: { warRoomId, userId, leftAt: null } })
  }

  addParticipant(warRoomId: string, dto: AddParticipantDto) {
    return this.db.warRoomParticipant.upsert({
      where: { warRoomId_userId: { warRoomId, userId: dto.userId } },
      create: { warRoomId, userId: dto.userId, role: dto.role as any },
      update: { role: dto.role as any, leftAt: null },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
  }

  removeParticipant(warRoomId: string, userId: string) {
    return this.db.warRoomParticipant.updateMany({
      where: { warRoomId, userId },
      data: { leftAt: new Date() },
    })
  }

  // Actions
  findAction(id: string) {
    return this.db.warRoomAction.findUnique({ where: { id } })
  }

  createAction(warRoomId: string, dto: CreateActionDto) {
    return this.db.warRoomAction.create({
      data: {
        warRoomId,
        title: dto.title,
        assignedUserId: dto.assignedUserId ?? null,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
      },
      include: { assignedUser: { select: { id: true, name: true } } },
    })
  }

  updateAction(id: string, dto: UpdateActionDto) {
    const completedAt = dto.status === 'DONE' ? new Date() : undefined
    return this.db.warRoomAction.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.assignedUserId !== undefined && { assignedUserId: dto.assignedUserId }),
        ...(dto.status && { status: dto.status as any }),
        ...(dto.dueAt !== undefined && { dueAt: dto.dueAt ? new Date(dto.dueAt) : null }),
        ...(completedAt && { completedAt }),
      },
      include: { assignedUser: { select: { id: true, name: true } } },
    })
  }

  // Timeline
  getTimeline(warRoomId: string) {
    return this.db.warRoomTimeline.findMany({
      where: { warRoomId },
      orderBy: { createdAt: 'asc' },
    })
  }

  addTimelineEntry(warRoomId: string, dto: AddTimelineEntryDto, actorId?: string) {
    return this.db.warRoomTimeline.create({
      data: {
        warRoomId,
        message: dto.message,
        type: dto.type ?? 'NOTE',
        actorId: actorId ?? null,
      },
    })
  }

  // Templates
  findTemplates() {
    return this.db.warRoomTemplate.findMany({ orderBy: { name: 'asc' } })
  }

  findTemplate(id: string) {
    return this.db.warRoomTemplate.findUnique({ where: { id } })
  }

  createTemplate(dto: CreateTemplateDto) {
    return this.db.warRoomTemplate.create({
      data: {
        name: dto.name,
        description: dto.description,
        defaultRoles: dto.defaultRoles ?? [],
        defaultActions: dto.defaultActions ?? [],
      },
    })
  }

  updateTemplate(id: string, dto: UpdateTemplateDto) {
    return this.db.warRoomTemplate.update({ where: { id }, data: dto as any })
  }

  deleteTemplate(id: string) {
    return this.db.warRoomTemplate.delete({ where: { id } })
  }
}

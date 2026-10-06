import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common'
import { WarRoomsRepository } from './war-rooms.repository'
import type {
  CreateWarRoomDto, UpdateWarRoomDto, AddParticipantDto,
  CreateActionDto, UpdateActionDto, AddTimelineEntryDto,
  CreateTemplateDto, UpdateTemplateDto,
} from './dto/war-room.dto'

@Injectable()
export class WarRoomsService {
  constructor(private readonly repo: WarRoomsRepository) {}

  findAll(status?: string) { return this.repo.findMany(status) }

  async findOne(id: string) {
    const room = await this.repo.findById(id)
    if (!room) throw new NotFoundException(`War room ${id} not found`)
    return room
  }

  async create(dto: CreateWarRoomDto, commanderId: string) {
    const room = await this.repo.create(dto, commanderId)
    // Auto-add commander as participant
    await this.repo.addParticipant(room.id, { userId: commanderId, role: 'INCIDENT_COMMANDER' })
    // Seed from template if provided
    if (dto.templateId) {
      const tpl = await this.repo.findTemplate(dto.templateId)
      if (tpl) {
        const actions = tpl.defaultActions as any[]
        for (const a of actions) {
          await this.repo.createAction(room.id, { title: a.title ?? a })
        }
      }
    }
    await this.repo.addTimelineEntry(room.id, { message: 'War room created', type: 'CREATED' }, commanderId)
    return this.repo.findById(room.id)
  }

  async update(id: string, dto: UpdateWarRoomDto, actorId: string) {
    await this.findOne(id)
    const room = await this.repo.update(id, dto)
    await this.repo.addTimelineEntry(id, { message: 'War room details updated', type: 'UPDATED' }, actorId)
    return room
  }

  async resolve(id: string, actorId: string) {
    const room = await this.findOne(id)
    if (room.status !== 'ACTIVE') throw new ConflictException('Only ACTIVE war rooms can be resolved')
    const resolved = await this.repo.resolve(id)
    await this.repo.addTimelineEntry(id, { message: 'War room resolved', type: 'RESOLVED' }, actorId)
    return resolved
  }

  async archive(id: string, actorId: string) {
    const room = await this.findOne(id)
    if (room.status === 'ARCHIVED') throw new ConflictException('War room is already archived')
    const archived = await this.repo.archive(id)
    await this.repo.addTimelineEntry(id, { message: 'War room archived', type: 'ARCHIVED' }, actorId)
    return archived
  }

  // Participants
  async addParticipant(id: string, dto: AddParticipantDto, actorId: string) {
    await this.findOne(id)
    const participant = await this.repo.addParticipant(id, dto)
    await this.repo.addTimelineEntry(id, { message: `Participant added`, type: 'PARTICIPANT_ADDED' }, actorId)
    return participant
  }

  async removeParticipant(id: string, userId: string, actorId: string) {
    await this.findOne(id)
    await this.repo.removeParticipant(id, userId)
    await this.repo.addTimelineEntry(id, { message: 'Participant removed', type: 'PARTICIPANT_REMOVED' }, actorId)
  }

  // Actions
  async createAction(warRoomId: string, dto: CreateActionDto, actorId: string) {
    await this.findOne(warRoomId)
    const action = await this.repo.createAction(warRoomId, dto)
    await this.repo.addTimelineEntry(warRoomId, { message: `Action created: ${dto.title}`, type: 'ACTION_CREATED' }, actorId)
    return action
  }

  async updateAction(warRoomId: string, actionId: string, dto: UpdateActionDto, actorId: string) {
    await this.findOne(warRoomId)
    const action = await this.repo.findAction(actionId)
    if (!action || action.warRoomId !== warRoomId) throw new NotFoundException(`Action ${actionId} not found`)
    const updated = await this.repo.updateAction(actionId, dto)
    if (dto.status === 'DONE') {
      await this.repo.addTimelineEntry(warRoomId, { message: `Action completed: ${action.title}`, type: 'ACTION_COMPLETED' }, actorId)
    }
    return updated
  }

  // Timeline
  async getTimeline(id: string) {
    await this.findOne(id)
    return this.repo.getTimeline(id)
  }

  async addTimelineEntry(id: string, dto: AddTimelineEntryDto, actorId: string) {
    await this.findOne(id)
    return this.repo.addTimelineEntry(id, dto, actorId)
  }

  // Templates
  findAllTemplates() { return this.repo.findTemplates() }

  async findTemplate(id: string) {
    const t = await this.repo.findTemplate(id)
    if (!t) throw new NotFoundException(`Template ${id} not found`)
    return t
  }

  createTemplate(dto: CreateTemplateDto) { return this.repo.createTemplate(dto) }

  async updateTemplate(id: string, dto: UpdateTemplateDto) {
    await this.findTemplate(id)
    return this.repo.updateTemplate(id, dto)
  }

  async deleteTemplate(id: string) {
    await this.findTemplate(id)
    return this.repo.deleteTemplate(id)
  }
}

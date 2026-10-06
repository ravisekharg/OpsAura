"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarRoomsService = void 0;
const common_1 = require("@nestjs/common");
const war_rooms_repository_1 = require("./war-rooms.repository");
let WarRoomsService = class WarRoomsService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll(status) { return this.repo.findMany(status); }
    async findOne(id) {
        const room = await this.repo.findById(id);
        if (!room)
            throw new common_1.NotFoundException(`War room ${id} not found`);
        return room;
    }
    async create(dto, commanderId) {
        const room = await this.repo.create(dto, commanderId);
        await this.repo.addParticipant(room.id, { userId: commanderId, role: 'INCIDENT_COMMANDER' });
        if (dto.templateId) {
            const tpl = await this.repo.findTemplate(dto.templateId);
            if (tpl) {
                const actions = tpl.defaultActions;
                for (const a of actions) {
                    await this.repo.createAction(room.id, { title: a.title ?? a });
                }
            }
        }
        await this.repo.addTimelineEntry(room.id, { message: 'War room created', type: 'CREATED' }, commanderId);
        return this.repo.findById(room.id);
    }
    async update(id, dto, actorId) {
        await this.findOne(id);
        const room = await this.repo.update(id, dto);
        await this.repo.addTimelineEntry(id, { message: 'War room details updated', type: 'UPDATED' }, actorId);
        return room;
    }
    async resolve(id, actorId) {
        const room = await this.findOne(id);
        if (room.status !== 'ACTIVE')
            throw new common_1.ConflictException('Only ACTIVE war rooms can be resolved');
        const resolved = await this.repo.resolve(id);
        await this.repo.addTimelineEntry(id, { message: 'War room resolved', type: 'RESOLVED' }, actorId);
        return resolved;
    }
    async archive(id, actorId) {
        const room = await this.findOne(id);
        if (room.status === 'ARCHIVED')
            throw new common_1.ConflictException('War room is already archived');
        const archived = await this.repo.archive(id);
        await this.repo.addTimelineEntry(id, { message: 'War room archived', type: 'ARCHIVED' }, actorId);
        return archived;
    }
    async addParticipant(id, dto, actorId) {
        await this.findOne(id);
        const participant = await this.repo.addParticipant(id, dto);
        await this.repo.addTimelineEntry(id, { message: `Participant added`, type: 'PARTICIPANT_ADDED' }, actorId);
        return participant;
    }
    async removeParticipant(id, userId, actorId) {
        await this.findOne(id);
        await this.repo.removeParticipant(id, userId);
        await this.repo.addTimelineEntry(id, { message: 'Participant removed', type: 'PARTICIPANT_REMOVED' }, actorId);
    }
    async createAction(warRoomId, dto, actorId) {
        await this.findOne(warRoomId);
        const action = await this.repo.createAction(warRoomId, dto);
        await this.repo.addTimelineEntry(warRoomId, { message: `Action created: ${dto.title}`, type: 'ACTION_CREATED' }, actorId);
        return action;
    }
    async updateAction(warRoomId, actionId, dto, actorId) {
        await this.findOne(warRoomId);
        const action = await this.repo.findAction(actionId);
        if (!action || action.warRoomId !== warRoomId)
            throw new common_1.NotFoundException(`Action ${actionId} not found`);
        const updated = await this.repo.updateAction(actionId, dto);
        if (dto.status === 'DONE') {
            await this.repo.addTimelineEntry(warRoomId, { message: `Action completed: ${action.title}`, type: 'ACTION_COMPLETED' }, actorId);
        }
        return updated;
    }
    async getTimeline(id) {
        await this.findOne(id);
        return this.repo.getTimeline(id);
    }
    async addTimelineEntry(id, dto, actorId) {
        await this.findOne(id);
        return this.repo.addTimelineEntry(id, dto, actorId);
    }
    findAllTemplates() { return this.repo.findTemplates(); }
    async findTemplate(id) {
        const t = await this.repo.findTemplate(id);
        if (!t)
            throw new common_1.NotFoundException(`Template ${id} not found`);
        return t;
    }
    createTemplate(dto) { return this.repo.createTemplate(dto); }
    async updateTemplate(id, dto) {
        await this.findTemplate(id);
        return this.repo.updateTemplate(id, dto);
    }
    async deleteTemplate(id) {
        await this.findTemplate(id);
        return this.repo.deleteTemplate(id);
    }
};
exports.WarRoomsService = WarRoomsService;
exports.WarRoomsService = WarRoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [war_rooms_repository_1.WarRoomsRepository])
], WarRoomsService);
//# sourceMappingURL=war-rooms.service.js.map
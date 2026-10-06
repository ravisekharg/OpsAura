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
exports.WarRoomsRepository = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const WAR_ROOM_INCLUDE = {
    service: { select: { id: true, name: true, tier: true } },
    incidentCommander: { select: { id: true, name: true, email: true } },
    participants: {
        where: { leftAt: null },
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { joinedAt: 'asc' },
    },
    actions: {
        include: { assignedUser: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' },
    },
    template: { select: { id: true, name: true } },
    _count: { select: { participants: true, actions: true, timeline: true } },
};
let WarRoomsRepository = class WarRoomsRepository {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
    }
    get db() { return this.tenantContext.getDb(); }
    findMany(status) {
        return this.db.warRoom.findMany({
            where: status ? { status: status } : {},
            include: {
                service: { select: { id: true, name: true } },
                incidentCommander: { select: { id: true, name: true } },
                _count: { select: { participants: true, actions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    findById(id) {
        return this.db.warRoom.findUnique({ where: { id }, include: WAR_ROOM_INCLUDE });
    }
    create(dto, commanderId) {
        return this.db.warRoom.create({
            data: {
                title: dto.title,
                description: dto.description,
                severity: dto.severity,
                serviceId: dto.serviceId ?? null,
                alertIds: dto.alertIds ?? [],
                templateId: dto.templateId ?? null,
                incidentCommanderId: commanderId,
            },
            include: WAR_ROOM_INCLUDE,
        });
    }
    update(id, dto) {
        return this.db.warRoom.update({ where: { id }, data: dto, include: WAR_ROOM_INCLUDE });
    }
    resolve(id) {
        return this.db.warRoom.update({
            where: { id },
            data: { status: 'RESOLVED', resolvedAt: new Date() },
            include: WAR_ROOM_INCLUDE,
        });
    }
    archive(id) {
        return this.db.warRoom.update({
            where: { id },
            data: { status: 'ARCHIVED' },
            include: WAR_ROOM_INCLUDE,
        });
    }
    findParticipant(warRoomId, userId) {
        return this.db.warRoomParticipant.findFirst({ where: { warRoomId, userId, leftAt: null } });
    }
    addParticipant(warRoomId, dto) {
        return this.db.warRoomParticipant.upsert({
            where: { warRoomId_userId: { warRoomId, userId: dto.userId } },
            create: { warRoomId, userId: dto.userId, role: dto.role },
            update: { role: dto.role, leftAt: null },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
    removeParticipant(warRoomId, userId) {
        return this.db.warRoomParticipant.updateMany({
            where: { warRoomId, userId },
            data: { leftAt: new Date() },
        });
    }
    findAction(id) {
        return this.db.warRoomAction.findUnique({ where: { id } });
    }
    createAction(warRoomId, dto) {
        return this.db.warRoomAction.create({
            data: {
                warRoomId,
                title: dto.title,
                assignedUserId: dto.assignedUserId ?? null,
                dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
            },
            include: { assignedUser: { select: { id: true, name: true } } },
        });
    }
    updateAction(id, dto) {
        const completedAt = dto.status === 'DONE' ? new Date() : undefined;
        return this.db.warRoomAction.update({
            where: { id },
            data: {
                ...(dto.title && { title: dto.title }),
                ...(dto.assignedUserId !== undefined && { assignedUserId: dto.assignedUserId }),
                ...(dto.status && { status: dto.status }),
                ...(dto.dueAt !== undefined && { dueAt: dto.dueAt ? new Date(dto.dueAt) : null }),
                ...(completedAt && { completedAt }),
            },
            include: { assignedUser: { select: { id: true, name: true } } },
        });
    }
    getTimeline(warRoomId) {
        return this.db.warRoomTimeline.findMany({
            where: { warRoomId },
            orderBy: { createdAt: 'asc' },
        });
    }
    addTimelineEntry(warRoomId, dto, actorId) {
        return this.db.warRoomTimeline.create({
            data: {
                warRoomId,
                message: dto.message,
                type: dto.type ?? 'NOTE',
                actorId: actorId ?? null,
            },
        });
    }
    findTemplates() {
        return this.db.warRoomTemplate.findMany({ orderBy: { name: 'asc' } });
    }
    findTemplate(id) {
        return this.db.warRoomTemplate.findUnique({ where: { id } });
    }
    createTemplate(dto) {
        return this.db.warRoomTemplate.create({
            data: {
                name: dto.name,
                description: dto.description,
                defaultRoles: dto.defaultRoles ?? [],
                defaultActions: dto.defaultActions ?? [],
            },
        });
    }
    updateTemplate(id, dto) {
        return this.db.warRoomTemplate.update({ where: { id }, data: dto });
    }
    deleteTemplate(id) {
        return this.db.warRoomTemplate.delete({ where: { id } });
    }
};
exports.WarRoomsRepository = WarRoomsRepository;
exports.WarRoomsRepository = WarRoomsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], WarRoomsRepository);
//# sourceMappingURL=war-rooms.repository.js.map
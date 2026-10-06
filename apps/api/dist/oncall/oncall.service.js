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
exports.OnCallService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const oncall_resolver_service_1 = require("../alerts/routing/oncall-resolver.service");
let OnCallService = class OnCallService {
    constructor(tenantContext, resolver) {
        this.tenantContext = tenantContext;
        this.resolver = resolver;
    }
    get db() { return this.tenantContext.getDb(); }
    getSchedules() {
        return this.db.schedule.findMany({
            include: {
                team: { select: { id: true, name: true } },
                _count: { select: { rotations: true, overrides: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async getSchedule(id) {
        const schedule = await this.db.schedule.findUnique({
            where: { id },
            include: {
                team: { select: { id: true, name: true } },
                rotations: { where: { active: true } },
                _count: { select: { overrides: true } },
            },
        });
        if (!schedule)
            throw new common_1.NotFoundException(`Schedule ${id} not found`);
        return schedule;
    }
    createSchedule(dto) {
        return this.db.schedule.create({
            data: {
                name: dto.name,
                description: dto.description,
                teamId: dto.teamId ?? null,
                timezone: dto.timezone,
                active: true,
            },
            include: { team: { select: { id: true, name: true } } },
        });
    }
    async updateSchedule(id, dto) {
        await this.getSchedule(id);
        return this.db.schedule.update({
            where: { id },
            data: dto,
            include: { team: { select: { id: true, name: true } } },
        });
    }
    async deleteSchedule(id) {
        await this.getSchedule(id);
        return this.db.schedule.update({ where: { id }, data: { active: false } });
    }
    getRotations(scheduleId) {
        return this.db.rotation.findMany({
            where: scheduleId ? { scheduleId } : {},
            include: { schedule: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    createRotation(dto) {
        return this.db.rotation.create({
            data: {
                scheduleId: dto.scheduleId,
                name: dto.name,
                type: dto.type,
                members: dto.members,
                handoffDay: dto.handoffDay ?? null,
                handoffTime: dto.handoffTime ? new Date(`1970-01-01T${dto.handoffTime}:00Z`) : null,
                active: true,
            },
            include: { schedule: { select: { id: true, name: true } } },
        });
    }
    updateRotation(id, dto) {
        return this.db.rotation.update({ where: { id }, data: dto });
    }
    deleteRotation(id) {
        return this.db.rotation.update({ where: { id }, data: { active: false } });
    }
    getOverrides(scheduleId) {
        return this.db.override.findMany({
            where: scheduleId ? { scheduleId } : {},
            include: {
                schedule: { select: { id: true, name: true } },
                originalUser: { select: { id: true, name: true } },
                overrideUser: { select: { id: true, name: true } },
            },
            orderBy: { startAt: 'asc' },
        });
    }
    createOverride(dto, createdBy) {
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
        });
    }
    deleteOverride(id) {
        return this.db.override.delete({ where: { id } });
    }
    async currentOnCall(assignmentGroupId) {
        if (assignmentGroupId)
            return this.resolver.resolveOnCall(assignmentGroupId);
        const groups = await this.db.assignmentGroup.findMany({
            where: { active: true },
            select: { id: true, name: true },
        });
        return Promise.all(groups.map(async (g) => ({
            group: g,
            oncall: await this.resolver.resolveOnCall(g.id),
        })));
    }
    async coverage(weekStart) {
        const start = weekStart ? new Date(weekStart) : this.getWeekStart(new Date());
        const end = new Date(start.getTime() + 7 * 86400000);
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
        });
        return { weekStart: start.toISOString(), schedules };
    }
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
        d.setHours(0, 0, 0, 0);
        return d;
    }
};
exports.OnCallService = OnCallService;
exports.OnCallService = OnCallService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService,
        oncall_resolver_service_1.OnCallResolverService])
], OnCallService);
//# sourceMappingURL=oncall.service.js.map
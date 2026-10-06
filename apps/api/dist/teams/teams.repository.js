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
exports.TeamsRepository = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let TeamsRepository = class TeamsRepository {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
    }
    get db() {
        return this.tenantContext.getDb();
    }
    async findMany(search) {
        const where = search
            ? { name: { contains: search, mode: 'insensitive' } }
            : {};
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
        });
    }
    async findById(id) {
        return this.db.team.findUnique({
            where: { id },
            include: {
                lead: { select: { id: true, name: true, email: true } },
                members: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                },
                _count: { select: { members: true, services: true } },
            },
        });
    }
    async create(data) {
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
        });
    }
    async update(id, data) {
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
        });
    }
    async delete(id) {
        return this.db.team.delete({ where: { id } });
    }
    async addMember(teamId, userId) {
        return this.db.teamMember.create({
            data: { teamId, userId },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
    async removeMember(teamId, userId) {
        return this.db.teamMember.delete({
            where: { teamId_userId: { teamId, userId } },
        });
    }
    async isMember(teamId, userId) {
        const m = await this.db.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId } },
        });
        return !!m;
    }
};
exports.TeamsRepository = TeamsRepository;
exports.TeamsRepository = TeamsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], TeamsRepository);
//# sourceMappingURL=teams.repository.js.map
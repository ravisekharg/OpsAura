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
exports.ServicesRepository = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let ServicesRepository = class ServicesRepository {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
        this.include = {
            team: { select: { id: true, name: true } },
            ownership: {
                include: {
                    primaryUser: { select: { id: true, name: true, email: true } },
                    secondaryUser: { select: { id: true, name: true, email: true } },
                    assignmentGroup: { select: { id: true, name: true } },
                },
            },
        };
    }
    get db() {
        return this.tenantContext.getDb();
    }
    async findMany(search) {
        const where = search
            ? { name: { contains: search, mode: 'insensitive' } }
            : {};
        return this.db.service.findMany({
            where,
            include: this.include,
            orderBy: [{ tier: 'asc' }, { name: 'asc' }],
        });
    }
    async findById(id) {
        return this.db.service.findUnique({ where: { id }, include: this.include });
    }
    async create(data) {
        return this.db.service.create({
            data: {
                name: data.name,
                description: data.description,
                teamId: data.teamId ?? null,
                tier: data.tier ?? 'P2',
                status: data.status ?? 'ACTIVE',
            },
            include: this.include,
        });
    }
    async update(id, data) {
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
        });
    }
    async delete(id) {
        return this.db.service.delete({ where: { id } });
    }
    async getOwnership(serviceId) {
        return this.db.serviceOwnership.findUnique({
            where: { serviceId },
            include: {
                primaryUser: { select: { id: true, name: true, email: true } },
                secondaryUser: { select: { id: true, name: true, email: true } },
                assignmentGroup: { select: { id: true, name: true } },
            },
        });
    }
    async upsertOwnership(serviceId, data) {
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
        });
    }
};
exports.ServicesRepository = ServicesRepository;
exports.ServicesRepository = ServicesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], ServicesRepository);
//# sourceMappingURL=services.repository.js.map
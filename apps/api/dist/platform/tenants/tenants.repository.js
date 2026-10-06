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
exports.TenantsRepository = void 0;
const common_1 = require("@nestjs/common");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
let TenantsRepository = class TenantsRepository {
    constructor(db) {
        this.db = db;
        this.include = {
            plan: { select: { id: true, name: true } },
            subscriptions: {
                select: { id: true, status: true, billingCycle: true, startsAt: true, endsAt: true },
                orderBy: { startsAt: 'desc' },
                take: 1,
            },
            _count: { select: { subscriptions: true } },
        };
    }
    async findMany(search, status) {
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status)
            where.status = status;
        return this.db.tenant.findMany({
            where,
            include: this.include,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.db.tenant.findUnique({ where: { id }, include: this.include });
    }
    async findBySlug(slug) {
        return this.db.tenant.findUnique({ where: { slug }, include: this.include });
    }
    async update(id, data) {
        return this.db.tenant.update({
            where: { id },
            data: data,
            include: this.include,
        });
    }
    async suspend(id) {
        return this.db.tenant.update({
            where: { id },
            data: { status: 'SUSPENDED', suspendedAt: new Date() },
            include: this.include,
        });
    }
};
exports.TenantsRepository = TenantsRepository;
exports.TenantsRepository = TenantsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService])
], TenantsRepository);
//# sourceMappingURL=tenants.repository.js.map
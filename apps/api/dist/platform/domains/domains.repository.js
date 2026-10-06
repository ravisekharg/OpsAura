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
exports.DomainsRepository = void 0;
const common_1 = require("@nestjs/common");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
let DomainsRepository = class DomainsRepository {
    constructor(db) {
        this.db = db;
    }
    findAll(tenantId) {
        return this.db.domain.findMany({
            where: tenantId ? { tenantId } : {},
            include: { tenant: { select: { id: true, slug: true, name: true } } },
            orderBy: { domain: 'asc' },
        });
    }
    findById(id) {
        return this.db.domain.findUnique({
            where: { id },
            include: { tenant: { select: { id: true, slug: true, name: true } } },
        });
    }
    findByDomain(domain) {
        return this.db.domain.findUnique({ where: { domain } });
    }
    create(data) {
        return this.db.domain.create({
            data: { tenantId: data.tenantId, domain: data.domain },
            include: { tenant: { select: { id: true, slug: true, name: true } } },
        });
    }
    verify(id) {
        return this.db.domain.update({
            where: { id },
            data: { verified: true, verifiedAt: new Date() },
            include: { tenant: { select: { id: true, slug: true, name: true } } },
        });
    }
    delete(id) {
        return this.db.domain.delete({ where: { id } });
    }
};
exports.DomainsRepository = DomainsRepository;
exports.DomainsRepository = DomainsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService])
], DomainsRepository);
//# sourceMappingURL=domains.repository.js.map
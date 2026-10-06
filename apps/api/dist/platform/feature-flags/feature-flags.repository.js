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
exports.FeatureFlagsRepository = void 0;
const common_1 = require("@nestjs/common");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
let FeatureFlagsRepository = class FeatureFlagsRepository {
    constructor(db) {
        this.db = db;
    }
    findAll() {
        return this.db.featureFlag.findMany({
            include: { overrides: { include: { tenant: { select: { id: true, slug: true, name: true } } } } },
            orderBy: { name: 'asc' },
        });
    }
    findById(id) {
        return this.db.featureFlag.findUnique({
            where: { id },
            include: { overrides: { include: { tenant: { select: { id: true, slug: true, name: true } } } } },
        });
    }
    create(data) {
        return this.db.featureFlag.create({
            data: { name: data.name, enabled: data.enabled ?? false },
        });
    }
    toggle(id, enabled) {
        return this.db.featureFlag.update({ where: { id }, data: { enabled } });
    }
    async setTenantOverride(flagId, dto) {
        return this.db.featureFlagOverride.upsert({
            where: { flagId_tenantId: { flagId, tenantId: dto.tenantId } },
            create: { flagId, tenantId: dto.tenantId, enabled: dto.enabled },
            update: { enabled: dto.enabled },
        });
    }
    async removeTenantOverride(flagId, tenantId) {
        return this.db.featureFlagOverride.deleteMany({ where: { flagId, tenantId } });
    }
    async isEnabledForTenant(flagName, tenantId) {
        const flag = await this.db.featureFlag.findUnique({
            where: { name: flagName },
            include: { overrides: { where: { tenantId } } },
        });
        if (!flag)
            return false;
        if (flag.overrides.length > 0)
            return flag.overrides[0].enabled;
        return flag.enabled;
    }
};
exports.FeatureFlagsRepository = FeatureFlagsRepository;
exports.FeatureFlagsRepository = FeatureFlagsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService])
], FeatureFlagsRepository);
//# sourceMappingURL=feature-flags.repository.js.map
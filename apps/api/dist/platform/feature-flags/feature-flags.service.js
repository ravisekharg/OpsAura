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
exports.FeatureFlagsService = void 0;
const common_1 = require("@nestjs/common");
const feature_flags_repository_1 = require("./feature-flags.repository");
let FeatureFlagsService = class FeatureFlagsService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll() { return this.repo.findAll(); }
    async findOne(id) {
        const flag = await this.repo.findById(id);
        if (!flag)
            throw new common_1.NotFoundException(`Feature flag ${id} not found`);
        return flag;
    }
    create(dto) { return this.repo.create(dto); }
    async toggle(id, enabled) {
        await this.findOne(id);
        return this.repo.toggle(id, enabled);
    }
    async setTenantOverride(id, dto) {
        await this.findOne(id);
        return this.repo.setTenantOverride(id, dto);
    }
    async removeTenantOverride(id, tenantId) {
        await this.findOne(id);
        return this.repo.removeTenantOverride(id, tenantId);
    }
    isEnabledForTenant(flagName, tenantId) {
        return this.repo.isEnabledForTenant(flagName, tenantId);
    }
};
exports.FeatureFlagsService = FeatureFlagsService;
exports.FeatureFlagsService = FeatureFlagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [feature_flags_repository_1.FeatureFlagsRepository])
], FeatureFlagsService);
//# sourceMappingURL=feature-flags.service.js.map
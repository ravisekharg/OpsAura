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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const services_repository_1 = require("./services.repository");
const plan_limits_service_1 = require("../subscription-enforcement/plan-limits.service");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let ServicesService = class ServicesService {
    constructor(repo, planLimits, tenantContext) {
        this.repo = repo;
        this.planLimits = planLimits;
        this.tenantContext = tenantContext;
    }
    findAll(search) { return this.repo.findMany(search); }
    async findOne(id) {
        const service = await this.repo.findById(id);
        if (!service)
            throw new common_1.NotFoundException(`Service ${id} not found`);
        return service;
    }
    async create(dto) {
        await this.planLimits.enforceLimit('services', this.tenantContext.getTenantSlug());
        return this.repo.create(dto);
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.repo.update(id, dto);
    }
    async remove(id) {
        await this.findOne(id);
        return this.repo.delete(id);
    }
    async getOwnership(serviceId) {
        await this.findOne(serviceId);
        return this.repo.getOwnership(serviceId);
    }
    async setOwnership(serviceId, dto) {
        await this.findOne(serviceId);
        return this.repo.upsertOwnership(serviceId, dto);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_repository_1.ServicesRepository,
        plan_limits_service_1.PlanLimitsService,
        tenant_context_service_1.TenantContextService])
], ServicesService);
//# sourceMappingURL=services.service.js.map
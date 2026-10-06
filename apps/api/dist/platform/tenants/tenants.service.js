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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const tenants_repository_1 = require("./tenants.repository");
const tenant_provisioner_service_1 = require("../provisioning/tenant-provisioner.service");
let TenantsService = class TenantsService {
    constructor(repo, provisioner) {
        this.repo = repo;
        this.provisioner = provisioner;
    }
    findAll(search, status) {
        return this.repo.findMany(search, status);
    }
    async findOne(id) {
        const tenant = await this.repo.findById(id);
        if (!tenant)
            throw new common_1.NotFoundException(`Tenant ${id} not found`);
        return tenant;
    }
    async findBySlug(slug) {
        const tenant = await this.repo.findBySlug(slug);
        if (!tenant)
            throw new common_1.NotFoundException(`Tenant "${slug}" not found`);
        return tenant;
    }
    async provision(dto, actorId, actorEmail) {
        return this.provisioner.provision(dto, actorId, actorEmail);
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.repo.update(id, dto);
    }
    async suspend(id) {
        await this.findOne(id);
        return this.repo.suspend(id);
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenants_repository_1.TenantsRepository,
        tenant_provisioner_service_1.TenantProvisionerService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map
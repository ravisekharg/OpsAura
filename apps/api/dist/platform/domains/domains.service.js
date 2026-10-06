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
exports.DomainsService = void 0;
const common_1 = require("@nestjs/common");
const domains_repository_1 = require("./domains.repository");
let DomainsService = class DomainsService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll(tenantId) { return this.repo.findAll(tenantId); }
    async findOne(id) {
        const domain = await this.repo.findById(id);
        if (!domain)
            throw new common_1.NotFoundException(`Domain ${id} not found`);
        return domain;
    }
    async add(dto) {
        const existing = await this.repo.findByDomain(dto.domain);
        if (existing)
            throw new common_1.ConflictException(`Domain "${dto.domain}" is already registered`);
        return this.repo.create(dto);
    }
    async verify(id) {
        await this.findOne(id);
        return this.repo.verify(id);
    }
    async remove(id) {
        await this.findOne(id);
        return this.repo.delete(id);
    }
};
exports.DomainsService = DomainsService;
exports.DomainsService = DomainsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [domains_repository_1.DomainsRepository])
], DomainsService);
//# sourceMappingURL=domains.service.js.map
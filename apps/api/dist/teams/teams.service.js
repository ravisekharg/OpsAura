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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const teams_repository_1 = require("./teams.repository");
let TeamsService = class TeamsService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll(search) {
        return this.repo.findMany(search);
    }
    async findOne(id) {
        const team = await this.repo.findById(id);
        if (!team)
            throw new common_1.NotFoundException(`Team ${id} not found`);
        return team;
    }
    create(dto) {
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
    async addMember(teamId, dto) {
        await this.findOne(teamId);
        const already = await this.repo.isMember(teamId, dto.userId);
        if (already)
            throw new common_1.ConflictException('User is already a member of this team');
        return this.repo.addMember(teamId, dto.userId);
    }
    async removeMember(teamId, userId) {
        await this.findOne(teamId);
        return this.repo.removeMember(teamId, userId);
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [teams_repository_1.TeamsRepository])
], TeamsService);
//# sourceMappingURL=teams.service.js.map
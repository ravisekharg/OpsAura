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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const users_repository_1 = require("./users.repository");
const plan_limits_service_1 = require("../subscription-enforcement/plan-limits.service");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let UsersService = UsersService_1 = class UsersService {
    constructor(repo, planLimits, tenantContext) {
        this.repo = repo;
        this.planLimits = planLimits;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const { items, total } = await this.repo.findMany({ ...query, page, limit });
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findOne(id) {
        const user = await this.repo.findById(id);
        if (!user)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return user;
    }
    async invite(dto, invitedById) {
        await this.planLimits.enforceLimit('users', this.tenantContext.getTenantSlug());
        const existing = await this.repo.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('A user with that email already exists');
        const role = await this.repo.findRoleByName(dto.roleName);
        if (!role)
            throw new common_1.BadRequestException(`Role '${dto.roleName}' not found`);
        const user = await this.repo.create({
            name: dto.name,
            email: dto.email,
            roleId: role.id,
            invitedBy: invitedById,
        });
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.repo.createPasswordResetToken(user.id, tokenHash, expiresAt);
        this.logger.log(`Invite token for ${user.email}: ${token.slice(0, 12)}...`);
        return user;
    }
    async update(id, dto) {
        await this.findOne(id);
        const patch = {};
        if (dto.name)
            patch.name = dto.name;
        if (dto.status)
            patch.status = dto.status;
        if (dto.roleName) {
            const role = await this.repo.findRoleByName(dto.roleName);
            if (!role)
                throw new common_1.BadRequestException(`Role '${dto.roleName}' not found`);
            patch.roleId = role.id;
        }
        return this.repo.update(id, patch);
    }
    async deactivate(id) {
        await this.findOne(id);
        return this.repo.deactivate(id);
    }
    async resendInvite(id) {
        const user = await this.findOne(id);
        if (user.status !== 'INVITED') {
            throw new common_1.BadRequestException('User is not in invited status');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.repo.createPasswordResetToken(user.id, tokenHash, expiresAt);
        this.logger.log(`Resent invite for ${user.email}`);
        return { message: 'Invite resent' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        plan_limits_service_1.PlanLimitsService,
        tenant_context_service_1.TenantContextService])
], UsersService);
//# sourceMappingURL=users.service.js.map
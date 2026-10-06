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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let UsersRepository = class UsersRepository {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
    }
    get db() {
        return this.tenantContext.getDb();
    }
    async findMany(query) {
        const { search, status, roleName, page, limit } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status)
            where.status = status;
        if (roleName)
            where.role = { name: roleName };
        const [items, total] = await Promise.all([
            this.db.user.findMany({
                where,
                skip,
                take: limit,
                include: { role: true, teamMemberships: { include: { team: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.db.user.count({ where }),
        ]);
        return { items, total };
    }
    async findById(id) {
        return this.db.user.findUnique({
            where: { id },
            include: { role: true, teamMemberships: { include: { team: true } } },
        });
    }
    async findByEmail(email) {
        return this.db.user.findUnique({
            where: { email },
            include: { role: true },
        });
    }
    async create(data) {
        return this.db.user.create({
            data: {
                name: data.name,
                email: data.email,
                roleId: data.roleId,
                passwordHash: data.passwordHash,
                status: 'INVITED',
                forcePasswordChange: true,
                invitedBy: data.invitedBy,
            },
            include: { role: true },
        });
    }
    async update(id, data) {
        return this.db.user.update({
            where: { id },
            data: data,
            include: { role: true },
        });
    }
    async deactivate(id) {
        return this.db.user.update({
            where: { id },
            data: { status: 'INACTIVE' },
        });
    }
    async findRoleByName(name) {
        return this.db.role.findUnique({ where: { name } });
    }
    async createPasswordResetToken(userId, tokenHash, expiresAt) {
        return this.db.passwordResetToken.create({
            data: { userId, tokenHash, expiresAt },
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map
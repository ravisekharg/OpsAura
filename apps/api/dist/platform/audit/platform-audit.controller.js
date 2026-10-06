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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformAuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_2 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const platform_guard_1 = require("../guards/platform.guard");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
class PlatformAuditQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 50;
    }
}
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlatformAuditQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlatformAuditQueryDto.prototype, "action", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlatformAuditQueryDto.prototype, "actorEmail", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PlatformAuditQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PlatformAuditQueryDto.prototype, "limit", void 0);
let PlatformAuditController = class PlatformAuditController {
    constructor(platformDb) {
        this.platformDb = platformDb;
    }
    async findAll(q) {
        const where = {};
        if (q.tenantId)
            where.tenantId = q.tenantId;
        if (q.action)
            where.action = { contains: q.action, mode: 'insensitive' };
        if (q.actorEmail)
            where.actorEmail = { contains: q.actorEmail, mode: 'insensitive' };
        const page = q.page ?? 1;
        const limit = q.limit ?? 50;
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.platformDb.globalAudit.findMany({
                where,
                skip,
                take: limit,
                include: { tenant: { select: { slug: true, name: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.platformDb.globalAudit.count({ where }),
        ]);
        return {
            data: items,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
};
exports.PlatformAuditController = PlatformAuditController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Platform-level audit log (tenant provisioning, suspensions)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlatformAuditQueryDto]),
    __metadata("design:returntype", Promise)
], PlatformAuditController.prototype, "findAll", null);
exports.PlatformAuditController = PlatformAuditController = __decorate([
    (0, swagger_1.ApiTags)('Platform — Audit'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('platform/audit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, platform_guard_1.PlatformGuard),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService])
], PlatformAuditController);
//# sourceMappingURL=platform-audit.controller.js.map
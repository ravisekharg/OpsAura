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
exports.DomainsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const platform_guard_1 = require("../guards/platform.guard");
const domains_service_1 = require("./domains.service");
const platform_dto_1 = require("../dto/platform.dto");
let DomainsController = class DomainsController {
    constructor(service) {
        this.service = service;
    }
    findAll(tenantId) {
        return this.service.findAll(tenantId);
    }
    findOne(id) { return this.service.findOne(id); }
    add(dto) { return this.service.add(dto); }
    verify(id) { return this.service.verify(id); }
    remove(id) { return this.service.remove(id); }
};
exports.DomainsController = DomainsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List domains, optionally filter by tenantId' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get domain by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, platform_guard_1.RequirePlatformRole)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a domain to a tenant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [platform_dto_1.AddDomainDto]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "add", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, platform_guard_1.RequirePlatformRole)('super_admin', 'admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mark domain as verified' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "verify", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, platform_guard_1.RequirePlatformRole)('super_admin', 'admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove domain' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "remove", null);
exports.DomainsController = DomainsController = __decorate([
    (0, swagger_1.ApiTags)('Platform — Domains'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('platform/domains'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, platform_guard_1.PlatformGuard),
    __metadata("design:paramtypes", [domains_service_1.DomainsService])
], DomainsController);
//# sourceMappingURL=domains.controller.js.map
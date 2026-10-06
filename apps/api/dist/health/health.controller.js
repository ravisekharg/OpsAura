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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const swagger_1 = require("@nestjs/swagger");
const bull_1 = require("@nestjs/bull");
const public_decorator_1 = require("../common/decorators/public.decorator");
const platform_prisma_service_1 = require("../database/platform-prisma.service");
let HealthController = class HealthController {
    constructor(health, platformDb, auditQueue) {
        this.health = health;
        this.platformDb = platformDb;
        this.auditQueue = auditQueue;
    }
    check() {
        return this.health.check([
            () => this.checkPlatformDb(),
            () => this.checkRedis(),
        ]);
    }
    async checkPlatformDb() {
        const key = 'platform_db';
        try {
            await this.platformDb.$queryRaw `SELECT 1`;
            return { [key]: { status: 'up' } };
        }
        catch (err) {
            return { [key]: { status: 'down', error: err.message } };
        }
    }
    async checkRedis() {
        const key = 'redis';
        try {
            const client = this.auditQueue.client;
            await new Promise((resolve, reject) => {
                client.ping((err) => (err ? reject(err) : resolve()));
            });
            return { [key]: { status: 'up' } };
        }
        catch (err) {
            return { [key]: { status: 'down', error: err.message } };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'System health — DB + Redis connectivity' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __param(2, (0, bull_1.InjectQueue)('audit-events')),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        platform_prisma_service_1.PlatformPrismaService, Object])
], HealthController);
//# sourceMappingURL=health.controller.js.map
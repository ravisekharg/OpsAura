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
var SubscriptionGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../common/decorators/public.decorator");
const platform_prisma_service_1 = require("../database/platform-prisma.service");
const ioredis_1 = require("ioredis");
const CACHE_TTL_SECONDS = 300;
const READONLY_METHODS = ['GET', 'HEAD', 'OPTIONS'];
let SubscriptionGuard = SubscriptionGuard_1 = class SubscriptionGuard {
    constructor(reflector, platformDb, config) {
        this.reflector = reflector;
        this.platformDb = platformDb;
        this.config = config;
        this.logger = new common_1.Logger(SubscriptionGuard_1.name);
        this.redis = new ioredis_1.default({
            host: config.get('REDIS_HOST', 'localhost'),
            port: config.get('REDIS_PORT', 6379),
            password: config.get('REDIS_PASSWORD') || undefined,
            keyPrefix: 'sub:',
            lazyConnect: true,
        });
        this.redis.on("error", () => { });
        this.redis.connect().catch(() => {
            this.logger.warn('Redis not available — subscription cache degraded');
        });
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return true;
        if (user.tenantSlug === 'platform')
            return true;
        const status = await this.getSubscriptionStatus(user.tenantSlug);
        if (status === 'CANCELLED') {
            throw new common_1.ForbiddenException({
                code: 'SUBSCRIPTION_CANCELLED',
                message: 'Your subscription has been cancelled. Please contact billing to reactivate.',
            });
        }
        if (status === 'PAST_DUE') {
            if (!READONLY_METHODS.includes(request.method)) {
                throw new common_1.ForbiddenException({
                    code: 'SUBSCRIPTION_PAST_DUE',
                    message: 'Your subscription payment is overdue. Write access is suspended until payment is resolved.',
                });
            }
        }
        request.subscriptionStatus = status;
        return true;
    }
    async getSubscriptionStatus(tenantSlug) {
        const cacheKey = tenantSlug;
        const cached = await this.redis.get(cacheKey).catch(() => null);
        if (cached)
            return cached;
        const tenant = await this.platformDb.tenant.findUnique({
            where: { slug: tenantSlug },
            select: { id: true, status: true },
        });
        if (!tenant)
            return 'CANCELLED';
        if (tenant.status === 'SUSPENDED' || tenant.status === 'CANCELLED') {
            await this.redis.set(cacheKey, 'CANCELLED', 'EX', CACHE_TTL_SECONDS).catch(() => null);
            return 'CANCELLED';
        }
        const subscription = await this.platformDb.subscription.findFirst({
            where: { tenantId: tenant.id },
            orderBy: { startsAt: 'desc' },
            select: { status: true },
        });
        const status = subscription?.status ?? 'TRIALING';
        await this.redis.set(cacheKey, status, 'EX', CACHE_TTL_SECONDS).catch(() => null);
        return status;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = SubscriptionGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        platform_prisma_service_1.PlatformPrismaService,
        config_1.ConfigService])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map
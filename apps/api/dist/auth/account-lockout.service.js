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
var AccountLockoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountLockoutService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_SECONDS = [
    0, 0, 0, 0, 0,
    900,
    3600,
    86400,
];
function getLockDuration(attempts) {
    if (attempts <= MAX_ATTEMPTS)
        return 0;
    if (attempts <= 10)
        return LOCK_DURATION_SECONDS[5];
    if (attempts <= 15)
        return LOCK_DURATION_SECONDS[6];
    return LOCK_DURATION_SECONDS[7];
}
let AccountLockoutService = AccountLockoutService_1 = class AccountLockoutService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(AccountLockoutService_1.name);
        this.redis = new ioredis_1.default({
            host: config.get('REDIS_HOST', 'localhost'),
            port: config.get('REDIS_PORT', 6379),
            password: config.get('REDIS_PASSWORD') || undefined,
            keyPrefix: 'lockout:',
            lazyConnect: true,
        });
        this.redis.on("error", () => { });
        this.redis.connect().catch(() => {
            this.logger.warn('Redis not available — lockout service degraded');
        });
    }
    key(tenantSlug, email) {
        return `${tenantSlug}:${email.toLowerCase()}`;
    }
    async recordFailedAttempt(tenantSlug, email) {
        const key = this.key(tenantSlug, email);
        const attempts = await this.redis.incr(key).catch(() => 1);
        if (attempts === 1) {
            await this.redis.expire(key, 86400).catch(() => null);
        }
        const lockDuration = getLockDuration(attempts);
        if (lockDuration > 0) {
            await this.redis.set(`${key}:locked`, '1', 'EX', lockDuration).catch(() => null);
            const lockedUntil = new Date(Date.now() + lockDuration * 1000);
            this.logger.warn(`Account locked: ${email} @ ${tenantSlug} — ${lockDuration}s`);
            return { locked: true, lockedUntil, attemptsRemaining: 0 };
        }
        const remaining = Math.max(0, MAX_ATTEMPTS - attempts);
        return { locked: false, attemptsRemaining: remaining };
    }
    async isLocked(tenantSlug, email) {
        const lockKey = `${this.key(tenantSlug, email)}:locked`;
        const locked = await this.redis.exists(lockKey).catch(() => 0);
        if (!locked)
            return { locked: false };
        const ttl = await this.redis.ttl(lockKey).catch(() => 0);
        const lockedUntil = new Date(Date.now() + ttl * 1000);
        return { locked: true, lockedUntil };
    }
    async clearLock(tenantSlug, email) {
        const key = this.key(tenantSlug, email);
        await Promise.all([
            this.redis.del(key).catch(() => null),
            this.redis.del(`${key}:locked`).catch(() => null),
        ]);
    }
    async recordSuccessfulLogin(tenantSlug, email) {
        await this.clearLock(tenantSlug, email);
    }
};
exports.AccountLockoutService = AccountLockoutService;
exports.AccountLockoutService = AccountLockoutService = AccountLockoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AccountLockoutService);
//# sourceMappingURL=account-lockout.service.js.map
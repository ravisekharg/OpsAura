import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

const MAX_ATTEMPTS = 5
const LOCK_DURATION_SECONDS = [
  0, 0, 0, 0, 0,         // attempts 1-5: no lock
  900,                   // attempt 6+: 15 min
  3600,                  // attempt 11+: 1 hour
  86400,                 // attempt 16+: 24 hours (requires admin unlock)
]

function getLockDuration(attempts: number): number {
  if (attempts <= MAX_ATTEMPTS) return 0
  if (attempts <= 10) return LOCK_DURATION_SECONDS[5]
  if (attempts <= 15) return LOCK_DURATION_SECONDS[6]
  return LOCK_DURATION_SECONDS[7]
}

@Injectable()
export class AccountLockoutService {
  private readonly logger = new Logger(AccountLockoutService.name)
  private readonly redis: Redis

  constructor(private readonly config: ConfigService) {
    this.redis = new Redis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      password: config.get('REDIS_PASSWORD') || undefined,
      keyPrefix: 'lockout:',
      lazyConnect: true,
    })
    this.redis.on("error", () => {})
    this.redis.connect().catch(() => {
      this.logger.warn('Redis not available — lockout service degraded')
    })
  }

  private key(tenantSlug: string, email: string): string {
    return `${tenantSlug}:${email.toLowerCase()}`
  }

  async recordFailedAttempt(tenantSlug: string, email: string): Promise<{ locked: boolean; lockedUntil?: Date; attemptsRemaining: number }> {
    const key = this.key(tenantSlug, email)
    const attempts = await this.redis.incr(key).catch(() => 1)

    // Set TTL on first attempt
    if (attempts === 1) {
      await this.redis.expire(key, 86400).catch(() => null)
    }

    const lockDuration = getLockDuration(attempts)

    if (lockDuration > 0) {
      await this.redis.set(`${key}:locked`, '1', 'EX', lockDuration).catch(() => null)
      const lockedUntil = new Date(Date.now() + lockDuration * 1000)
      this.logger.warn(`Account locked: ${email} @ ${tenantSlug} — ${lockDuration}s`)
      return { locked: true, lockedUntil, attemptsRemaining: 0 }
    }

    const remaining = Math.max(0, MAX_ATTEMPTS - attempts)
    return { locked: false, attemptsRemaining: remaining }
  }

  async isLocked(tenantSlug: string, email: string): Promise<{ locked: boolean; lockedUntil?: Date }> {
    const lockKey = `${this.key(tenantSlug, email)}:locked`
    const locked = await this.redis.exists(lockKey).catch(() => 0)

    if (!locked) return { locked: false }

    const ttl = await this.redis.ttl(lockKey).catch(() => 0)
    const lockedUntil = new Date(Date.now() + ttl * 1000)
    return { locked: true, lockedUntil }
  }

  async clearLock(tenantSlug: string, email: string): Promise<void> {
    const key = this.key(tenantSlug, email)
    await Promise.all([
      this.redis.del(key).catch(() => null),
      this.redis.del(`${key}:locked`).catch(() => null),
    ])
  }

  async recordSuccessfulLogin(tenantSlug: string, email: string): Promise<void> {
    await this.clearLock(tenantSlug, email)
  }
}

import { ConfigService } from '@nestjs/config';
export declare class AccountLockoutService {
    private readonly config;
    private readonly logger;
    private readonly redis;
    constructor(config: ConfigService);
    private key;
    recordFailedAttempt(tenantSlug: string, email: string): Promise<{
        locked: boolean;
        lockedUntil?: Date;
        attemptsRemaining: number;
    }>;
    isLocked(tenantSlug: string, email: string): Promise<{
        locked: boolean;
        lockedUntil?: Date;
    }>;
    clearLock(tenantSlug: string, email: string): Promise<void>;
    recordSuccessfulLogin(tenantSlug: string, email: string): Promise<void>;
}

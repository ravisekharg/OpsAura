import { HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';
import { Queue } from 'bull';
import { PlatformPrismaService } from '../database/platform-prisma.service';
export declare class HealthController {
    private readonly health;
    private readonly platformDb;
    private readonly auditQueue;
    constructor(health: HealthCheckService, platformDb: PlatformPrismaService, auditQueue: Queue);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult<HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & HealthIndicatorResult, Partial<HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & HealthIndicatorResult> | undefined, Partial<HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & HealthIndicatorResult> | undefined>>;
    private checkPlatformDb;
    private checkRedis;
}

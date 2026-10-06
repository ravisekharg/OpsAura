import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PlatformPrismaService } from '../database/platform-prisma.service';
export declare class SubscriptionGuard implements CanActivate {
    private readonly reflector;
    private readonly platformDb;
    private readonly config;
    private readonly logger;
    private readonly redis;
    constructor(reflector: Reflector, platformDb: PlatformPrismaService, config: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getSubscriptionStatus;
}

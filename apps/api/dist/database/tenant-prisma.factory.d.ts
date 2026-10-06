import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/tenant-client';
export declare class TenantPrismaFactory implements OnModuleDestroy {
    private readonly config;
    private readonly logger;
    private readonly clients;
    private readonly baseUrl;
    constructor(config: ConfigService);
    getClient(tenantSlug: string): PrismaClient;
    createTenantDatabase(tenantSlug: string): Promise<void>;
    disconnectTenant(tenantSlug: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
}

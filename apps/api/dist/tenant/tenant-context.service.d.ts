import { PrismaClient } from '@prisma/tenant-client';
export interface TenantContext {
    tenantSlug: string;
    db: PrismaClient;
}
export declare class TenantContextService {
    private readonly storage;
    run<T>(context: TenantContext, fn: () => T): T;
    getContext(): TenantContext;
    getDb(): PrismaClient;
    getTenantSlug(): string;
    hasContext(): boolean;
}

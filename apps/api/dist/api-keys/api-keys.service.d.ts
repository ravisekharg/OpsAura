import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantPrismaFactory } from '../database/tenant-prisma.factory';
import type { CreateApiKeyDto } from './dto/api-key.dto';
export declare class ApiKeysService {
    private readonly tenantContext;
    private readonly tenantFactory;
    constructor(tenantContext: TenantContextService, tenantFactory: TenantPrismaFactory);
    private get db();
    findAll(userId: string): import("@prisma/tenant-client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        scopes: import("@prisma/tenant-client/runtime/library").JsonValue;
        prefix: string;
        lastUsedAt: Date | null;
    }[]>;
    create(userId: string, dto: CreateApiKeyDto): Promise<{
        key: string;
        id: string;
        prefix: string;
    }>;
    revoke(id: string, userId: string): Promise<void>;
    validateKey(rawKey: string, tenantSlug: string): Promise<{
        id: string;
        email: string;
        name: string;
        tenantSlug: string;
        role: string;
        permissions: string[];
        requiresPasswordChange: boolean;
    }>;
}

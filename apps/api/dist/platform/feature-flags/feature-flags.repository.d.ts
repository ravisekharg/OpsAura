import { PlatformPrismaService } from '../../database/platform-prisma.service';
import type { CreateFeatureFlagDto, SetTenantOverrideDto } from '../dto/platform.dto';
export declare class FeatureFlagsRepository {
    private readonly db;
    constructor(db: PlatformPrismaService);
    findAll(): import("@prisma/platform-client").Prisma.PrismaPromise<({
        overrides: ({
            tenant: {
                name: string;
                id: string;
                slug: string;
            };
        } & {
            id: string;
            enabled: boolean;
            tenantId: string;
            flagId: string;
        })[];
    } & {
        name: string;
        id: string;
        enabled: boolean;
    })[]>;
    findById(id: string): import("@prisma/platform-client").Prisma.Prisma__FeatureFlagClient<({
        overrides: ({
            tenant: {
                name: string;
                id: string;
                slug: string;
            };
        } & {
            id: string;
            enabled: boolean;
            tenantId: string;
            flagId: string;
        })[];
    } & {
        name: string;
        id: string;
        enabled: boolean;
    }) | null, null, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    create(data: CreateFeatureFlagDto): import("@prisma/platform-client").Prisma.Prisma__FeatureFlagClient<{
        name: string;
        id: string;
        enabled: boolean;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    toggle(id: string, enabled: boolean): import("@prisma/platform-client").Prisma.Prisma__FeatureFlagClient<{
        name: string;
        id: string;
        enabled: boolean;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    setTenantOverride(flagId: string, dto: SetTenantOverrideDto): Promise<{
        id: string;
        enabled: boolean;
        tenantId: string;
        flagId: string;
    }>;
    removeTenantOverride(flagId: string, tenantId: string): Promise<import("@prisma/platform-client").Prisma.BatchPayload>;
    isEnabledForTenant(flagName: string, tenantId: string): Promise<boolean>;
}

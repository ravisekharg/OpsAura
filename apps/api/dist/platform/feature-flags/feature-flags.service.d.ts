import { FeatureFlagsRepository } from './feature-flags.repository';
import type { CreateFeatureFlagDto, SetTenantOverrideDto } from '../dto/platform.dto';
export declare class FeatureFlagsService {
    private readonly repo;
    constructor(repo: FeatureFlagsRepository);
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
    findOne(id: string): Promise<{
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
    }>;
    create(dto: CreateFeatureFlagDto): import("@prisma/platform-client").Prisma.Prisma__FeatureFlagClient<{
        name: string;
        id: string;
        enabled: boolean;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    toggle(id: string, enabled: boolean): Promise<{
        name: string;
        id: string;
        enabled: boolean;
    }>;
    setTenantOverride(id: string, dto: SetTenantOverrideDto): Promise<{
        id: string;
        enabled: boolean;
        tenantId: string;
        flagId: string;
    }>;
    removeTenantOverride(id: string, tenantId: string): Promise<import("@prisma/platform-client").Prisma.BatchPayload>;
    isEnabledForTenant(flagName: string, tenantId: string): Promise<boolean>;
}

import { FeatureFlagsService } from './feature-flags.service';
import { CreateFeatureFlagDto, SetTenantOverrideDto } from '../dto/platform.dto';
declare class ToggleDto {
    enabled: boolean;
}
export declare class FeatureFlagsController {
    private readonly service;
    constructor(service: FeatureFlagsService);
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
    toggle(id: string, dto: ToggleDto): Promise<{
        name: string;
        id: string;
        enabled: boolean;
    }>;
    setOverride(id: string, dto: SetTenantOverrideDto): Promise<{
        id: string;
        enabled: boolean;
        tenantId: string;
        flagId: string;
    }>;
    removeOverride(id: string, tenantId: string): Promise<import("@prisma/platform-client").Prisma.BatchPayload>;
}
export {};

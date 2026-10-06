import { TenantContextService } from '../tenant/tenant-context.service';
import { PlatformPrismaService } from '../database/platform-prisma.service';
export type LimitedResource = 'users' | 'services' | 'schedules' | 'teams';
export declare class PlanLimitsService {
    private readonly tenantContext;
    private readonly platformDb;
    private readonly logger;
    constructor(tenantContext: TenantContextService, platformDb: PlatformPrismaService);
    enforceLimit(resource: LimitedResource, tenantSlug: string): Promise<void>;
    private countResource;
}

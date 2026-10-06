import { TenantContextService } from '../../tenant/tenant-context.service';
import type { NormalizedAlert } from '../dto/ingest.dto';
export declare class RoutingEngineService {
    private readonly tenantContext;
    private readonly logger;
    constructor(tenantContext: TenantContextService);
    private get db();
    resolveAssignmentGroup(alert: NormalizedAlert): Promise<string | null>;
    private evaluateCondition;
    private extractFieldValue;
    private getDefaultAssignmentGroupId;
}

import { TenantContextService } from '../../tenant/tenant-context.service';
export interface OnCallResult {
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    scheduleName: string | null;
    isOverride: boolean;
    rotationName: string | null;
}
export declare class OnCallResolverService {
    private readonly tenantContext;
    private readonly logger;
    constructor(tenantContext: TenantContextService);
    private get db();
    resolveOnCall(assignmentGroupId: string): Promise<OnCallResult>;
    private resolveCurrentMember;
}

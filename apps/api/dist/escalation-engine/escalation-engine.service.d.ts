import { Queue } from 'bull';
import { TenantContextService } from '../tenant/tenant-context.service';
export interface EscalationStepJob {
    escalationId: string;
    tenantSlug: string;
    stepOrder: number;
}
export declare class EscalationEngineService {
    private readonly stepQueue;
    private readonly tenantContext;
    private readonly logger;
    constructor(stepQueue: Queue, tenantContext: TenantContextService);
    private get db();
    startEscalation(escalationId: string, tenantSlug: string): Promise<void>;
    acknowledgeEscalation(escalationId: string): Promise<void>;
    resolveEscalation(escalationId: string): Promise<void>;
    executeStep(job: EscalationStepJob): Promise<void>;
}

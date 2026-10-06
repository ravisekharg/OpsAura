import { Job } from 'bull';
import { TenantPrismaFactory } from '../database/tenant-prisma.factory';
import { TenantContextService } from '../tenant/tenant-context.service';
import { EscalationEngineService, type EscalationStepJob } from './escalation-engine.service';
export declare class EscalationEngineProcessor {
    private readonly engine;
    private readonly tenantFactory;
    private readonly tenantContext;
    private readonly logger;
    constructor(engine: EscalationEngineService, tenantFactory: TenantPrismaFactory, tenantContext: TenantContextService);
    handleStep(job: Job<EscalationStepJob>): Promise<void>;
}

import { Job } from 'bull';
import { PlatformPrismaService } from '../database/platform-prisma.service';
import { AuditService } from '../audit/audit.service';
export declare class TrialExpiryProcessor {
    private readonly platformDb;
    private readonly auditService;
    private readonly logger;
    constructor(platformDb: PlatformPrismaService, auditService: AuditService);
    checkExpiredTrials(_job: Job): Promise<void>;
}

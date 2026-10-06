import { Job } from 'bull';
import { TenantPrismaFactory } from '../database/tenant-prisma.factory';
import { PlatformPrismaService } from '../database/platform-prisma.service';
import type { AuditEventPayload } from './interfaces/audit-event.interface';
export declare class AuditProcessor {
    private readonly tenantFactory;
    private readonly platformDb;
    private readonly logger;
    constructor(tenantFactory: TenantPrismaFactory, platformDb: PlatformPrismaService);
    handlePersist(job: Job<AuditEventPayload>): Promise<void>;
    private writeTenantAudit;
    private writePlatformAudit;
}

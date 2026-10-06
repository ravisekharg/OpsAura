import { ConfigService } from '@nestjs/config';
import { PlatformPrismaService } from '../../database/platform-prisma.service';
import { TenantPrismaFactory } from '../../database/tenant-prisma.factory';
import { AuditService } from '../../audit/audit.service';
import type { ProvisionTenantDto } from '../dto/platform.dto';
export interface ProvisionResult {
    tenantId: string;
    slug: string;
    name: string;
    adminEmail: string;
    dbName: string;
    message: string;
}
export declare class TenantProvisionerService {
    private readonly platformDb;
    private readonly tenantFactory;
    private readonly config;
    private readonly auditService;
    private readonly logger;
    private readonly bcryptRounds;
    constructor(platformDb: PlatformPrismaService, tenantFactory: TenantPrismaFactory, config: ConfigService, auditService: AuditService);
    provision(dto: ProvisionTenantDto, actorId: string, actorEmail: string): Promise<ProvisionResult>;
    private assertSlugAvailable;
    private ensureDefaultPlan;
    private pushTenantSchema;
    private generateTempPassword;
}

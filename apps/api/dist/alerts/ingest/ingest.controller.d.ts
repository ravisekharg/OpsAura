import { IngestService } from './ingest.service';
import { AlertsService } from '../alerts.service';
import { TenantPrismaFactory } from '../../database/tenant-prisma.factory';
import { TenantContextService } from '../../tenant/tenant-context.service';
import { PlatformPrismaService } from '../../database/platform-prisma.service';
import { GenericIngestDto, PrometheusWebhookDto } from '../dto/ingest.dto';
export declare class IngestController {
    private readonly ingestService;
    private readonly alertsService;
    private readonly tenantFactory;
    private readonly tenantContext;
    private readonly platformDb;
    constructor(ingestService: IngestService, alertsService: AlertsService, tenantFactory: TenantPrismaFactory, tenantContext: TenantContextService, platformDb: PlatformPrismaService);
    ingestGeneric(dto: GenericIngestDto, tenantSlug: string): Promise<import("../alerts.service").AlertIngestionResult>;
    ingestPrometheus(dto: PrometheusWebhookDto, tenantSlug: string): Promise<{
        processed: number;
        results: import("../alerts.service").AlertIngestionResult[];
    }>;
    private runInTenantContext;
}

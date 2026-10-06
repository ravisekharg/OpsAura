import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger'
import { Public } from '../../common/decorators/public.decorator'
import { IngestService } from './ingest.service'
import { AlertsService } from '../alerts.service'
import { TenantPrismaFactory } from '../../database/tenant-prisma.factory'
import { TenantContextService } from '../../tenant/tenant-context.service'
import { PlatformPrismaService } from '../../database/platform-prisma.service'
import { GenericIngestDto, PrometheusWebhookDto } from '../dto/ingest.dto'

@ApiTags('Alert Ingest')
@Controller('ingest')
export class IngestController {
  constructor(
    private readonly ingestService: IngestService,
    private readonly alertsService: AlertsService,
    private readonly tenantFactory: TenantPrismaFactory,
    private readonly tenantContext: TenantContextService,
    private readonly platformDb: PlatformPrismaService,
  ) {}

  // Ingest endpoints use API key or shared secret auth (not JWT)
  // X-Tenant-Slug header identifies the tenant
  // X-Api-Key header carries the ingest API key
  // For Phase 1: accept any valid tenant slug

  @Public()
  @Post('generic')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Generic JSON alert ingest' })
  @ApiHeader({ name: 'X-Tenant-Slug', required: true })
  async ingestGeneric(
    @Body() dto: GenericIngestDto,
    @Headers('x-tenant-slug') tenantSlug: string,
  ) {
    return this.runInTenantContext(tenantSlug, async () => {
      const normalized = this.ingestService.normalizeGeneric(dto)
      return this.alertsService.ingest(normalized)
    })
  }

  @Public()
  @Post('prometheus')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Prometheus Alertmanager webhook receiver' })
  @ApiHeader({ name: 'X-Tenant-Slug', required: true })
  async ingestPrometheus(
    @Body() dto: PrometheusWebhookDto,
    @Headers('x-tenant-slug') tenantSlug: string,
  ) {
    return this.runInTenantContext(tenantSlug, async () => {
      const alerts = this.ingestService.normalizePrometheus(dto)
      const results = await Promise.all(
        alerts.map((a) => this.alertsService.ingest(a)),
      )
      return { processed: results.length, results }
    })
  }

  // Helper: sets up tenant context for ingest requests (no JWT)
  private async runInTenantContext<T>(tenantSlug: string, fn: () => Promise<T>): Promise<T> {
    const tenant = await this.platformDb.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { status: true },
    })

    if (!tenant || tenant.status !== 'ACTIVE') {
      throw new Error(`Tenant ${tenantSlug} not found or inactive`)
    }

    const db = this.tenantFactory.getClient(tenantSlug)
    return this.tenantContext.run({ tenantSlug, db }, fn)
  }
}

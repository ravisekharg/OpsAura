"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const ingest_service_1 = require("./ingest.service");
const alerts_service_1 = require("../alerts.service");
const tenant_prisma_factory_1 = require("../../database/tenant-prisma.factory");
const tenant_context_service_1 = require("../../tenant/tenant-context.service");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
const ingest_dto_1 = require("../dto/ingest.dto");
let IngestController = class IngestController {
    constructor(ingestService, alertsService, tenantFactory, tenantContext, platformDb) {
        this.ingestService = ingestService;
        this.alertsService = alertsService;
        this.tenantFactory = tenantFactory;
        this.tenantContext = tenantContext;
        this.platformDb = platformDb;
    }
    async ingestGeneric(dto, tenantSlug) {
        return this.runInTenantContext(tenantSlug, async () => {
            const normalized = this.ingestService.normalizeGeneric(dto);
            return this.alertsService.ingest(normalized);
        });
    }
    async ingestPrometheus(dto, tenantSlug) {
        return this.runInTenantContext(tenantSlug, async () => {
            const alerts = this.ingestService.normalizePrometheus(dto);
            const results = await Promise.all(alerts.map((a) => this.alertsService.ingest(a)));
            return { processed: results.length, results };
        });
    }
    async runInTenantContext(tenantSlug, fn) {
        const tenant = await this.platformDb.tenant.findUnique({
            where: { slug: tenantSlug },
            select: { status: true },
        });
        if (!tenant || tenant.status !== 'ACTIVE') {
            throw new Error(`Tenant ${tenantSlug} not found or inactive`);
        }
        const db = this.tenantFactory.getClient(tenantSlug);
        return this.tenantContext.run({ tenantSlug, db }, fn);
    }
};
exports.IngestController = IngestController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('generic'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({ summary: 'Generic JSON alert ingest' }),
    (0, swagger_1.ApiHeader)({ name: 'X-Tenant-Slug', required: true }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-tenant-slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingest_dto_1.GenericIngestDto, String]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestGeneric", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('prometheus'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({ summary: 'Prometheus Alertmanager webhook receiver' }),
    (0, swagger_1.ApiHeader)({ name: 'X-Tenant-Slug', required: true }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-tenant-slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingest_dto_1.PrometheusWebhookDto, String]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestPrometheus", null);
exports.IngestController = IngestController = __decorate([
    (0, swagger_1.ApiTags)('Alert Ingest'),
    (0, common_1.Controller)('ingest'),
    __metadata("design:paramtypes", [ingest_service_1.IngestService,
        alerts_service_1.AlertsService,
        tenant_prisma_factory_1.TenantPrismaFactory,
        tenant_context_service_1.TenantContextService,
        platform_prisma_service_1.PlatformPrismaService])
], IngestController);
//# sourceMappingURL=ingest.controller.js.map
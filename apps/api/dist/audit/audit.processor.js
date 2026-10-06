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
var AuditProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const tenant_prisma_factory_1 = require("../database/tenant-prisma.factory");
const platform_prisma_service_1 = require("../database/platform-prisma.service");
const PLATFORM_TENANT_SLUG = 'platform';
let AuditProcessor = AuditProcessor_1 = class AuditProcessor {
    constructor(tenantFactory, platformDb) {
        this.tenantFactory = tenantFactory;
        this.platformDb = platformDb;
        this.logger = new common_1.Logger(AuditProcessor_1.name);
    }
    async handlePersist(job) {
        const event = job.data;
        try {
            if (event.tenantSlug === PLATFORM_TENANT_SLUG) {
                await this.writePlatformAudit(event);
            }
            else {
                await this.writeTenantAudit(event);
            }
        }
        catch (err) {
            this.logger.error(`Failed to persist audit event [${event.action}] for tenant [${event.tenantSlug}]`, err);
            throw err;
        }
    }
    async writeTenantAudit(event) {
        const db = this.tenantFactory.getClient(event.tenantSlug);
        await db.auditEvent.create({
            data: {
                category: event.category,
                action: event.action,
                actorId: event.actorId ?? null,
                actorEmail: event.actorEmail ?? null,
                target: event.target ?? null,
                detail: event.detail ?? null,
                severity: event.severity ?? 'INFO',
                ipAddress: event.ipAddress ?? null,
                userAgent: event.userAgent ?? null,
            },
        });
    }
    async writePlatformAudit(event) {
        await this.platformDb.globalAudit.create({
            data: {
                actorId: event.actorId ?? null,
                actorEmail: event.actorEmail ?? null,
                action: event.action,
                target: event.target ?? null,
                detail: event.detail ?? null,
                ipAddress: event.ipAddress ?? null,
            },
        });
    }
};
exports.AuditProcessor = AuditProcessor;
__decorate([
    (0, bull_1.Process)('persist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditProcessor.prototype, "handlePersist", null);
exports.AuditProcessor = AuditProcessor = AuditProcessor_1 = __decorate([
    (0, bull_1.Processor)('audit-events'),
    __metadata("design:paramtypes", [tenant_prisma_factory_1.TenantPrismaFactory,
        platform_prisma_service_1.PlatformPrismaService])
], AuditProcessor);
//# sourceMappingURL=audit.processor.js.map
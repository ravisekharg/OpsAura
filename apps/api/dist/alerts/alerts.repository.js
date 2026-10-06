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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsRepository = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let AlertsRepository = class AlertsRepository {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
        this.include = {
            service: { select: { id: true, name: true, tier: true } },
            assignmentGroup: { select: { id: true, name: true } },
            assignedUser: { select: { id: true, name: true, email: true } },
        };
    }
    get db() {
        return this.tenantContext.getDb();
    }
    async findMany(query) {
        const { status, severity, serviceId, assignmentGroupId, search, page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (severity)
            where.severity = severity;
        if (serviceId)
            where.serviceId = serviceId;
        if (assignmentGroupId)
            where.assignmentGroupId = assignmentGroupId;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.db.alert.findMany({
                where,
                skip,
                take: limit,
                include: this.include,
                orderBy: [
                    { severity: 'asc' },
                    { firedAt: 'desc' },
                ],
            }),
            this.db.alert.count({ where }),
        ]);
        return { items, total };
    }
    async findById(id) {
        return this.db.alert.findUnique({ where: { id }, include: this.include });
    }
    async findByFingerprint(fingerprint, windowMinutes) {
        const since = new Date(Date.now() - windowMinutes * 60 * 1000);
        return this.db.alert.findFirst({
            where: {
                fingerprint,
                status: { in: ['FIRING', 'ACKNOWLEDGED'] },
                firedAt: { gte: since },
            },
            orderBy: { firedAt: 'desc' },
        });
    }
    async incrementDedupCount(id) {
        return this.db.alert.update({
            where: { id },
            data: { dedupCount: { increment: 1 } },
        });
    }
    async create(data) {
        return this.db.alert.create({
            data: {
                title: data.title,
                description: data.description,
                severity: data.severity,
                status: data.status,
                serviceId: data.serviceId ?? null,
                source: data.source ?? null,
                assignmentGroupId: data.assignmentGroupId ?? null,
                assignedUserId: data.assignedUserId ?? null,
                tags: data.tags,
                fingerprint: data.fingerprint,
                correlationGroupId: data.correlationGroupId ?? null,
                rawPayload: (data.rawPayload ?? undefined),
            },
            include: this.include,
        });
    }
    async acknowledge(id, userId) {
        return this.db.alert.update({
            where: { id },
            data: {
                status: 'ACKNOWLEDGED',
                assignedUserId: userId,
                acknowledgedAt: new Date(),
            },
            include: this.include,
        });
    }
    async resolve(id) {
        return this.db.alert.update({
            where: { id },
            data: { status: 'RESOLVED', resolvedAt: new Date() },
            include: this.include,
        });
    }
    async suppress(id) {
        return this.db.alert.update({
            where: { id },
            data: { status: 'SUPPRESSED' },
            include: this.include,
        });
    }
    async findActiveSuppressionRules() {
        return this.db.suppressionRule.findMany({
            where: {
                active: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } },
                ],
            },
        });
    }
    async createSuppressionRule(data) {
        return this.db.suppressionRule.create({ data: data });
    }
    async findSuppressionRules() {
        return this.db.suppressionRule.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async updateSuppressionRule(id, data) {
        return this.db.suppressionRule.update({ where: { id }, data: data });
    }
    async findActiveCorrelationRules() {
        return this.db.correlationRule.findMany({ where: { active: true } });
    }
    async findCorrelationRules() {
        return this.db.correlationRule.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async createCorrelationRule(data) {
        return this.db.correlationRule.create({ data: data });
    }
    async updateCorrelationRule(id, data) {
        return this.db.correlationRule.update({ where: { id }, data: data });
    }
};
exports.AlertsRepository = AlertsRepository;
exports.AlertsRepository = AlertsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], AlertsRepository);
//# sourceMappingURL=alerts.repository.js.map
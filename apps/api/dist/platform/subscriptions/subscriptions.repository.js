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
exports.SubscriptionsRepository = void 0;
const common_1 = require("@nestjs/common");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
let SubscriptionsRepository = class SubscriptionsRepository {
    constructor(db) {
        this.db = db;
        this.include = {
            tenant: { select: { id: true, slug: true, name: true } },
            plan: { select: { id: true, name: true, priceMonthly: true } },
        };
    }
    findAll(tenantId) {
        return this.db.subscription.findMany({
            where: tenantId ? { tenantId } : {},
            include: this.include,
            orderBy: { startsAt: 'desc' },
        });
    }
    findById(id) {
        return this.db.subscription.findUnique({ where: { id }, include: this.include });
    }
    findActiveByTenant(tenantId) {
        return this.db.subscription.findFirst({
            where: { tenantId, status: { in: ['ACTIVE', 'TRIALING'] } },
            include: this.include,
            orderBy: { startsAt: 'desc' },
        });
    }
    create(data) {
        return this.db.subscription.create({
            data: {
                tenantId: data.tenantId,
                planId: data.planId,
                status: 'TRIALING',
                billingCycle: (data.billingCycle ?? 'MONTHLY'),
                startsAt: new Date(),
            },
            include: this.include,
        });
    }
    update(id, data) {
        return this.db.subscription.update({
            where: { id },
            data: {
                status: data.status,
                planId: data.planId,
                billingCycle: data.billingCycle,
            },
            include: this.include,
        });
    }
    cancel(id) {
        return this.db.subscription.update({
            where: { id },
            data: { status: 'CANCELLED', endsAt: new Date() },
            include: this.include,
        });
    }
};
exports.SubscriptionsRepository = SubscriptionsRepository;
exports.SubscriptionsRepository = SubscriptionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService])
], SubscriptionsRepository);
//# sourceMappingURL=subscriptions.repository.js.map
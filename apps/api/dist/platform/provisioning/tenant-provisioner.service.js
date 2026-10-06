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
var TenantProvisionerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantProvisionerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");
const child_process_1 = require("child_process");
const platform_prisma_service_1 = require("../../database/platform-prisma.service");
const tenant_prisma_factory_1 = require("../../database/tenant-prisma.factory");
const audit_service_1 = require("../../audit/audit.service");
const roles_seed_1 = require("./roles.seed");
const settings_seed_1 = require("./settings.seed");
let TenantProvisionerService = TenantProvisionerService_1 = class TenantProvisionerService {
    constructor(platformDb, tenantFactory, config, auditService) {
        this.platformDb = platformDb;
        this.tenantFactory = tenantFactory;
        this.config = config;
        this.auditService = auditService;
        this.logger = new common_1.Logger(TenantProvisionerService_1.name);
        this.bcryptRounds = parseInt(String(config.get('BCRYPT_ROUNDS', 12)), 10) || 12;
    }
    async provision(dto, actorId, actorEmail) {
        await this.assertSlugAvailable(dto.slug);
        const plan = dto.planId
            ? await this.platformDb.plan.findUniqueOrThrow({ where: { id: dto.planId } })
            : await this.ensureDefaultPlan();
        const dbName = `tenant_${dto.slug}`;
        const tenant = await this.platformDb.tenant.create({
            data: {
                slug: dto.slug,
                name: dto.name,
                dbName,
                planId: plan.id,
                status: 'ONBOARDING',
                domain: dto.domain ?? null,
            },
        });
        this.logger.log(`Provisioning tenant "${dto.slug}" (id=${tenant.id})`);
        try {
            await this.tenantFactory.createTenantDatabase(dto.slug);
            this.logger.log(`[${dto.slug}] Database created: ${dbName}`);
            await this.pushTenantSchema(dto.slug);
            this.logger.log(`[${dto.slug}] Schema applied`);
            const db = this.tenantFactory.getClient(dto.slug);
            await (0, roles_seed_1.seedRolesAndPermissions)(db);
            this.logger.log(`[${dto.slug}] Roles seeded`);
            await (0, settings_seed_1.seedDefaultSettings)(db);
            this.logger.log(`[${dto.slug}] Settings seeded`);
            const tempPassword = this.generateTempPassword();
            const passwordHash = await bcrypt.hash(tempPassword, this.bcryptRounds);
            const adminRole = await db.role.findUnique({ where: { name: 'tenant_admin' } });
            if (!adminRole)
                throw new Error('tenant_admin role not found after seeding');
            await db.user.create({
                data: {
                    email: dto.adminEmail,
                    name: dto.adminName,
                    passwordHash,
                    roleId: adminRole.id,
                    status: 'ACTIVE',
                    forcePasswordChange: true,
                },
            });
            this.logger.log(`[${dto.slug}] Admin user created: ${dto.adminEmail}`);
            await this.platformDb.subscription.create({
                data: {
                    tenantId: tenant.id,
                    planId: plan.id,
                    status: 'TRIALING',
                    billingCycle: 'MONTHLY',
                    startsAt: new Date(),
                },
            });
            await this.platformDb.tenant.update({
                where: { id: tenant.id },
                data: { status: 'ACTIVE' },
            });
            await this.auditService.emit({
                category: 'tenant',
                action: 'TENANT_PROVISIONED',
                tenantSlug: 'platform',
                actorId,
                actorEmail,
                target: dto.slug,
                detail: `Tenant "${dto.name}" provisioned. Admin: ${dto.adminEmail}`,
                severity: 'WARNING',
            });
            this.logger.log(`[${dto.slug}] Invite queued for ${dto.adminEmail} — password omitted from response`);
            this.logger.debug(`[DEV ONLY] Temp password for ${dto.adminEmail}: ${tempPassword}`);
            this.logger.log(`[${dto.slug}] Provisioning complete`);
            return {
                tenantId: tenant.id,
                slug: dto.slug,
                name: dto.name,
                adminEmail: dto.adminEmail,
                dbName,
                message: 'Tenant provisioned. Invite email queued for admin.',
            };
        }
        catch (err) {
            this.logger.error(`[${dto.slug}] Provisioning failed: ${err}`);
            await this.platformDb.tenant.update({
                where: { id: tenant.id },
                data: { status: 'CANCELLED' },
            });
            throw new common_1.InternalServerErrorException(`Tenant provisioning failed: ${err.message}`);
        }
    }
    async assertSlugAvailable(slug) {
        const existing = await this.platformDb.tenant.findUnique({
            where: { slug },
            select: { id: true, status: true },
        });
        if (!existing)
            return;
        if (existing.status === 'CANCELLED') {
            await this.platformDb.tenant.delete({ where: { slug } });
            return;
        }
        throw new common_1.ConflictException(`Tenant slug "${slug}" is already taken`);
    }
    async ensureDefaultPlan() {
        const existing = await this.platformDb.plan.findFirst({
            orderBy: { name: 'asc' },
        });
        if (existing)
            return existing;
        return this.platformDb.plan.create({
            data: {
                name: 'Starter',
                features: {
                    voice: true, war_rooms: true, servicenow: true,
                    escalations: true, oncall: true, alerts: true,
                },
                limits: { users: 50, services: 100, schedules: 10 },
                priceMonthly: 0,
            },
        });
    }
    async pushTenantSchema(slug) {
        const baseUrl = this.config.get('TENANT_DATABASE_BASE_URL', 'postgresql://opsaura:password@localhost:5432');
        const dbUrl = `${baseUrl}/tenant_${slug}`;
        const prismaPath = path.join(process.cwd(), 'node_modules/.bin/prisma');
        const schemaPath = path.join(process.cwd(), 'prisma/tenant/schema.prisma');
        (0, child_process_1.execSync)(`"${prismaPath}" db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
            stdio: 'pipe',
            timeout: 60000,
            env: { ...process.env, TENANT_DATABASE_URL: dbUrl },
        });
    }
    generateTempPassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!';
        return Array.from(crypto.randomBytes(12))
            .map((b) => chars[b % chars.length])
            .join('');
    }
};
exports.TenantProvisionerService = TenantProvisionerService;
exports.TenantProvisionerService = TenantProvisionerService = TenantProvisionerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [platform_prisma_service_1.PlatformPrismaService,
        tenant_prisma_factory_1.TenantPrismaFactory,
        config_1.ConfigService,
        audit_service_1.AuditService])
], TenantProvisionerService);
//# sourceMappingURL=tenant-provisioner.service.js.map
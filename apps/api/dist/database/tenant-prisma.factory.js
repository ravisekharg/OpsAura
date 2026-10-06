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
var TenantPrismaFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPrismaFactory = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const tenant_client_1 = require("@prisma/tenant-client");
let TenantPrismaFactory = TenantPrismaFactory_1 = class TenantPrismaFactory {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(TenantPrismaFactory_1.name);
        this.clients = new Map();
        this.baseUrl = config.get('TENANT_DATABASE_BASE_URL', 'postgresql://opsaura:password@localhost:5432');
    }
    getClient(tenantSlug) {
        if (this.clients.has(tenantSlug)) {
            return this.clients.get(tenantSlug);
        }
        const dbName = `tenant_${tenantSlug}`;
        const url = `${this.baseUrl}/${dbName}`;
        const client = new tenant_client_1.PrismaClient({
            datasources: { db: { url } },
            log: ['warn', 'error'],
        });
        this.clients.set(tenantSlug, client);
        this.logger.debug(`Created PrismaClient for tenant: ${tenantSlug}`);
        return client;
    }
    async createTenantDatabase(tenantSlug) {
        const dbName = `tenant_${tenantSlug}`;
        const adminClient = new tenant_client_1.PrismaClient({
            datasources: { db: { url: `${this.baseUrl}/postgres` } },
        });
        try {
            await adminClient.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
            this.logger.log(`Created database: ${dbName}`);
        }
        catch (err) {
            if (!err?.message?.includes('already exists'))
                throw err;
            this.logger.warn(`Database ${dbName} already exists — skipping CREATE`);
        }
        finally {
            await adminClient.$disconnect();
        }
    }
    async disconnectTenant(tenantSlug) {
        const client = this.clients.get(tenantSlug);
        if (client) {
            await client.$disconnect();
            this.clients.delete(tenantSlug);
        }
    }
    async onModuleDestroy() {
        const disconnects = Array.from(this.clients.values()).map((c) => c.$disconnect());
        await Promise.all(disconnects);
        this.logger.log(`Disconnected ${this.clients.size} tenant DB clients`);
    }
};
exports.TenantPrismaFactory = TenantPrismaFactory;
exports.TenantPrismaFactory = TenantPrismaFactory = TenantPrismaFactory_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TenantPrismaFactory);
//# sourceMappingURL=tenant-prisma.factory.js.map
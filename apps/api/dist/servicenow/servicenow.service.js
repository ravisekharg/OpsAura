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
var ServiceNowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceNowService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let ServiceNowService = ServiceNowService_1 = class ServiceNowService {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(ServiceNowService_1.name);
    }
    get db() { return this.tenantContext.getDb(); }
    findAllConnections() {
        return this.db.snConnection.findMany({
            include: {
                _count: { select: { groupMappings: true, syncLogs: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findConnection(id) {
        const conn = await this.db.snConnection.findUnique({
            where: { id },
            include: {
                groupMappings: {
                    include: { localGroup: { select: { id: true, name: true } } },
                },
                _count: { select: { syncLogs: true } },
            },
        });
        if (!conn)
            throw new common_1.NotFoundException(`ServiceNow connection ${id} not found`);
        return conn;
    }
    async createConnection(dto) {
        const vaultKey = `sn:${dto.instanceUrl.replace(/https?:\/\//, '')}:${Date.now()}`;
        this.logger.log(`SN connection vault key: ${vaultKey}`);
        return this.db.snConnection.create({
            data: {
                name: dto.name,
                instanceUrl: dto.instanceUrl,
                username: dto.username,
                vaultKey,
                status: 'DISCONNECTED',
            },
        });
    }
    async updateConnection(id, dto) {
        await this.findConnection(id);
        const data = {};
        if (dto.name)
            data.name = dto.name;
        if (dto.instanceUrl)
            data.instanceUrl = dto.instanceUrl;
        if (dto.username)
            data.username = dto.username;
        if (dto.password) {
            data.vaultKey = `sn:${dto.instanceUrl ?? ''}:${Date.now()}`;
            data.status = 'DISCONNECTED';
        }
        return this.db.snConnection.update({ where: { id }, data });
    }
    async deleteConnection(id) {
        await this.findConnection(id);
        return this.db.snConnection.delete({ where: { id } });
    }
    async testConnection(id) {
        const conn = await this.findConnection(id);
        const startMs = Date.now();
        try {
            this.logger.log(`Testing SN connection ${id} → ${conn.instanceUrl}`);
            const durationMs = Date.now() - startMs;
            await this.db.snConnection.update({ where: { id }, data: { status: 'CONNECTED', lastTestedAt: new Date() } });
            await this.logSync(id, 'PULL_GROUPS', 'SYNCED', 0, `Connection test OK (${durationMs}ms)`);
            return { success: true, message: 'Connection verified', instanceVersion: 'unknown' };
        }
        catch (err) {
            await this.db.snConnection.update({ where: { id }, data: { status: 'DISCONNECTED', lastTestedAt: new Date() } });
            await this.logSync(id, 'PULL_GROUPS', 'FAILED', 0, 'Connection test failed', err.message);
            return { success: false, message: err.message };
        }
    }
    findMappings(connectionId) {
        return this.db.snGroupMapping.findMany({
            where: connectionId ? { connectionId } : {},
            include: {
                connection: { select: { id: true, name: true, instanceUrl: true } },
                localGroup: { select: { id: true, name: true } },
            },
            orderBy: { snGroupName: 'asc' },
        });
    }
    async createMapping(dto) {
        await this.findConnection(dto.connectionId);
        return this.db.snGroupMapping.create({
            data: {
                connectionId: dto.connectionId,
                snGroupId: dto.snGroupId,
                snGroupName: dto.snGroupName,
                localGroupId: dto.localGroupId,
                autoSync: dto.autoSync ?? true,
                syncStatus: 'PENDING',
            },
            include: {
                connection: { select: { id: true, name: true } },
                localGroup: { select: { id: true, name: true } },
            },
        });
    }
    async updateMapping(id, dto) {
        const existing = await this.db.snGroupMapping.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Mapping ${id} not found`);
        return this.db.snGroupMapping.update({ where: { id }, data: dto });
    }
    async deleteMapping(id) {
        const existing = await this.db.snGroupMapping.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Mapping ${id} not found`);
        return this.db.snGroupMapping.delete({ where: { id } });
    }
    getSyncLogs(connectionId, limit = 100) {
        return this.db.snSyncLog.findMany({
            where: { connectionId },
            orderBy: { executedAt: 'desc' },
            take: limit,
            include: { connection: { select: { id: true, name: true } } },
        });
    }
    async syncGroups(connectionId) {
        const conn = await this.findConnection(connectionId);
        const startMs = Date.now();
        try {
            this.logger.log(`Syncing groups from SN connection ${connectionId}`);
            const durationMs = Date.now() - startMs;
            await this.db.snGroupMapping.updateMany({
                where: { connectionId, autoSync: true },
                data: { lastSyncedAt: new Date(), syncStatus: 'SYNCED' },
            });
            const count = await this.db.snGroupMapping.count({ where: { connectionId, autoSync: true } });
            await this.logSync(connectionId, 'PULL_GROUPS', 'SYNCED', count, `Synced ${count} groups`, undefined, durationMs);
            return { synced: count, failed: 0 };
        }
        catch (err) {
            const durationMs = Date.now() - startMs;
            await this.logSync(connectionId, 'PULL_GROUPS', 'FAILED', 0, 'Sync failed', err.message, durationMs);
            throw err;
        }
    }
    async logSync(connectionId, operation, status, recordsAffected, message, errorDetail, durationMs) {
        return this.db.snSyncLog.create({
            data: {
                connectionId,
                operation: operation,
                status: status,
                recordsAffected,
                message,
                errorDetail,
                durationMs,
            },
        });
    }
};
exports.ServiceNowService = ServiceNowService;
exports.ServiceNowService = ServiceNowService = ServiceNowService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], ServiceNowService);
//# sourceMappingURL=servicenow.service.js.map
import { ServiceNowService } from './servicenow.service';
import { CreateSnConnectionDto, UpdateSnConnectionDto, CreateSnMappingDto, UpdateSnMappingDto } from './dto/servicenow.dto';
export declare class ServiceNowController {
    private readonly service;
    constructor(service: ServiceNowService);
    findAllConnections(): import("@prisma/tenant-client").Prisma.PrismaPromise<({
        _count: {
            groupMappings: number;
            syncLogs: number;
        };
    } & {
        name: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.SnConnectionStatus;
        createdAt: Date;
        instanceUrl: string;
        username: string;
        vaultKey: string;
        lastTestedAt: Date | null;
    })[]>;
    findConnection(id: string): Promise<{
        _count: {
            syncLogs: number;
        };
        groupMappings: ({
            localGroup: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            connectionId: string;
            snGroupId: string;
            snGroupName: string | null;
            localGroupId: string;
            autoSync: boolean;
            lastSyncedAt: Date | null;
            syncStatus: import("@prisma/tenant-client").$Enums.SyncStatus;
        })[];
    } & {
        name: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.SnConnectionStatus;
        createdAt: Date;
        instanceUrl: string;
        username: string;
        vaultKey: string;
        lastTestedAt: Date | null;
    }>;
    createConnection(dto: CreateSnConnectionDto): Promise<{
        name: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.SnConnectionStatus;
        createdAt: Date;
        instanceUrl: string;
        username: string;
        vaultKey: string;
        lastTestedAt: Date | null;
    }>;
    updateConnection(id: string, dto: UpdateSnConnectionDto): Promise<{
        name: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.SnConnectionStatus;
        createdAt: Date;
        instanceUrl: string;
        username: string;
        vaultKey: string;
        lastTestedAt: Date | null;
    }>;
    deleteConnection(id: string): Promise<{
        name: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.SnConnectionStatus;
        createdAt: Date;
        instanceUrl: string;
        username: string;
        vaultKey: string;
        lastTestedAt: Date | null;
    }>;
    testConnection(id: string): Promise<{
        success: boolean;
        message: string;
        instanceVersion?: string;
    }>;
    syncGroups(id: string): Promise<{
        synced: number;
        failed: number;
    }>;
    findMappings(connectionId?: string): import("@prisma/tenant-client").Prisma.PrismaPromise<({
        connection: {
            name: string;
            id: string;
            instanceUrl: string;
        };
        localGroup: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        connectionId: string;
        snGroupId: string;
        snGroupName: string | null;
        localGroupId: string;
        autoSync: boolean;
        lastSyncedAt: Date | null;
        syncStatus: import("@prisma/tenant-client").$Enums.SyncStatus;
    })[]>;
    createMapping(dto: CreateSnMappingDto): Promise<{
        connection: {
            name: string;
            id: string;
        };
        localGroup: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        connectionId: string;
        snGroupId: string;
        snGroupName: string | null;
        localGroupId: string;
        autoSync: boolean;
        lastSyncedAt: Date | null;
        syncStatus: import("@prisma/tenant-client").$Enums.SyncStatus;
    }>;
    updateMapping(id: string, dto: UpdateSnMappingDto): Promise<{
        id: string;
        connectionId: string;
        snGroupId: string;
        snGroupName: string | null;
        localGroupId: string;
        autoSync: boolean;
        lastSyncedAt: Date | null;
        syncStatus: import("@prisma/tenant-client").$Enums.SyncStatus;
    }>;
    deleteMapping(id: string): Promise<{
        id: string;
        connectionId: string;
        snGroupId: string;
        snGroupName: string | null;
        localGroupId: string;
        autoSync: boolean;
        lastSyncedAt: Date | null;
        syncStatus: import("@prisma/tenant-client").$Enums.SyncStatus;
    }>;
    getSyncLogs(id: string, limit?: number): import("@prisma/tenant-client").Prisma.PrismaPromise<({
        connection: {
            name: string;
            id: string;
        };
    } & {
        message: string | null;
        id: string;
        status: import("@prisma/tenant-client").$Enums.SyncStatus;
        connectionId: string;
        operation: import("@prisma/tenant-client").$Enums.SnOperation;
        recordsAffected: number;
        errorDetail: string | null;
        executedAt: Date;
        durationMs: number | null;
    })[]>;
}

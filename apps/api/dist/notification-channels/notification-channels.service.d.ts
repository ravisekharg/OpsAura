import { ConfigService } from '@nestjs/config';
import { TenantContextService } from '../tenant/tenant-context.service';
import type { CreateNotificationChannelDto, UpdateNotificationChannelDto } from './dto/notification-channel.dto';
export declare class NotificationChannelsService {
    private readonly tenantContext;
    private readonly config;
    private readonly logger;
    constructor(tenantContext: TenantContextService, config: ConfigService);
    private get db();
    private get encKey();
    findAll(): import("@prisma/tenant-client").Prisma.PrismaPromise<{
        type: import("@prisma/tenant-client").$Enums.ChannelType;
        name: string;
        id: string;
        updatedAt: Date;
        connected: boolean;
    }[]>;
    findOne(id: string): Promise<{
        type: import("@prisma/tenant-client").$Enums.ChannelType;
        name: string;
        id: string;
        updatedAt: Date;
        connected: boolean;
    }>;
    getDecryptedConfig<T = Record<string, any>>(id: string): Promise<T>;
    create(dto: CreateNotificationChannelDto): Promise<{
        type: import("@prisma/tenant-client").$Enums.ChannelType;
        name: string;
        id: string;
        updatedAt: Date;
        connected: boolean;
    }>;
    update(id: string, dto: UpdateNotificationChannelDto): Promise<{
        type: import("@prisma/tenant-client").$Enums.ChannelType;
        name: string;
        id: string;
        updatedAt: Date;
        connected: boolean;
    }>;
    remove(id: string): Promise<{
        type: import("@prisma/tenant-client").$Enums.ChannelType;
        name: string;
        id: string;
        updatedAt: Date;
        configVaultKey: string;
        connected: boolean;
    }>;
    testConnection(id: string, recipient?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private runTest;
    getDeliveryLog(channelId: string, limit?: number): Promise<{
        alert: {
            title: string;
            id: string;
        } | null;
        id: string;
        status: import("@prisma/tenant-client").$Enums.DeliveryStatus;
        subject: string | null;
        recipient: string;
        errorMessage: string | null;
        retryCount: number;
        sentAt: Date | null;
    }[]>;
}

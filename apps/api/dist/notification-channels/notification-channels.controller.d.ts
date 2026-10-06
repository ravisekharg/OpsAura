import { NotificationChannelsService } from './notification-channels.service';
import { CreateNotificationChannelDto, UpdateNotificationChannelDto, TestNotificationChannelDto } from './dto/notification-channel.dto';
export declare class NotificationChannelsController {
    private readonly service;
    constructor(service: NotificationChannelsService);
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
    testConnection(id: string, dto: TestNotificationChannelDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deliveryLog(id: string, limit?: number): Promise<{
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

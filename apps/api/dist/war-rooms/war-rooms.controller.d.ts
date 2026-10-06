import { WarRoomsService } from './war-rooms.service';
import { CreateWarRoomDto, UpdateWarRoomDto, AddParticipantDto, CreateActionDto, UpdateActionDto, AddTimelineEntryDto, CreateTemplateDto, UpdateTemplateDto } from './dto/war-room.dto';
import type { RequestUser } from '../common/interfaces/request-user.interface';
export declare class WarRoomsController {
    private readonly service;
    constructor(service: WarRoomsService);
    findAll(status?: string): import("@prisma/tenant-client").Prisma.PrismaPromise<({
        service: {
            name: string;
            id: string;
        } | null;
        _count: {
            participants: number;
            actions: number;
        };
        incidentCommander: {
            name: string;
            id: string;
        };
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.WarRoomStatus;
        createdAt: Date;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        serviceId: string | null;
        resolvedAt: Date | null;
        alertIds: string[];
        templateId: string | null;
        incidentCommanderId: string;
    })[]>;
    findOne(id: string): Promise<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        _count: {
            participants: number;
            actions: number;
            timeline: number;
        };
        incidentCommander: {
            name: string;
            email: string;
            id: string;
        };
        template: {
            name: string;
            id: string;
        } | null;
        participants: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            role: import("@prisma/tenant-client").$Enums.WarRoomParticipantRole;
            id: string;
            userId: string;
            joinedAt: Date;
            warRoomId: string;
            leftAt: Date | null;
        })[];
        actions: ({
            assignedUser: {
                name: string;
                id: string;
            } | null;
        } & {
            title: string;
            id: string;
            status: import("@prisma/tenant-client").$Enums.ActionStatus;
            createdAt: Date;
            assignedUserId: string | null;
            dueAt: Date | null;
            warRoomId: string;
            completedAt: Date | null;
        })[];
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.WarRoomStatus;
        createdAt: Date;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        serviceId: string | null;
        resolvedAt: Date | null;
        alertIds: string[];
        templateId: string | null;
        incidentCommanderId: string;
    }>;
    create(dto: CreateWarRoomDto, user: RequestUser): Promise<({
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        _count: {
            participants: number;
            actions: number;
            timeline: number;
        };
        incidentCommander: {
            name: string;
            email: string;
            id: string;
        };
        template: {
            name: string;
            id: string;
        } | null;
        participants: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            role: import("@prisma/tenant-client").$Enums.WarRoomParticipantRole;
            id: string;
            userId: string;
            joinedAt: Date;
            warRoomId: string;
            leftAt: Date | null;
        })[];
        actions: ({
            assignedUser: {
                name: string;
                id: string;
            } | null;
        } & {
            title: string;
            id: string;
            status: import("@prisma/tenant-client").$Enums.ActionStatus;
            createdAt: Date;
            assignedUserId: string | null;
            dueAt: Date | null;
            warRoomId: string;
            completedAt: Date | null;
        })[];
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.WarRoomStatus;
        createdAt: Date;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        serviceId: string | null;
        resolvedAt: Date | null;
        alertIds: string[];
        templateId: string | null;
        incidentCommanderId: string;
    }) | null>;
    update(id: string, dto: UpdateWarRoomDto, user: RequestUser): Promise<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        _count: {
            participants: number;
            actions: number;
            timeline: number;
        };
        incidentCommander: {
            name: string;
            email: string;
            id: string;
        };
        template: {
            name: string;
            id: string;
        } | null;
        participants: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            role: import("@prisma/tenant-client").$Enums.WarRoomParticipantRole;
            id: string;
            userId: string;
            joinedAt: Date;
            warRoomId: string;
            leftAt: Date | null;
        })[];
        actions: ({
            assignedUser: {
                name: string;
                id: string;
            } | null;
        } & {
            title: string;
            id: string;
            status: import("@prisma/tenant-client").$Enums.ActionStatus;
            createdAt: Date;
            assignedUserId: string | null;
            dueAt: Date | null;
            warRoomId: string;
            completedAt: Date | null;
        })[];
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.WarRoomStatus;
        createdAt: Date;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        serviceId: string | null;
        resolvedAt: Date | null;
        alertIds: string[];
        templateId: string | null;
        incidentCommanderId: string;
    }>;
    resolve(id: string, user: RequestUser): Promise<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        _count: {
            participants: number;
            actions: number;
            timeline: number;
        };
        incidentCommander: {
            name: string;
            email: string;
            id: string;
        };
        template: {
            name: string;
            id: string;
        } | null;
        participants: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            role: import("@prisma/tenant-client").$Enums.WarRoomParticipantRole;
            id: string;
            userId: string;
            joinedAt: Date;
            warRoomId: string;
            leftAt: Date | null;
        })[];
        actions: ({
            assignedUser: {
                name: string;
                id: string;
            } | null;
        } & {
            title: string;
            id: string;
            status: import("@prisma/tenant-client").$Enums.ActionStatus;
            createdAt: Date;
            assignedUserId: string | null;
            dueAt: Date | null;
            warRoomId: string;
            completedAt: Date | null;
        })[];
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.WarRoomStatus;
        createdAt: Date;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        serviceId: string | null;
        resolvedAt: Date | null;
        alertIds: string[];
        templateId: string | null;
        incidentCommanderId: string;
    }>;
    archive(id: string, user: RequestUser): Promise<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        _count: {
            participants: number;
            actions: number;
            timeline: number;
        };
        incidentCommander: {
            name: string;
            email: string;
            id: string;
        };
        template: {
            name: string;
            id: string;
        } | null;
        participants: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            role: import("@prisma/tenant-client").$Enums.WarRoomParticipantRole;
            id: string;
            userId: string;
            joinedAt: Date;
            warRoomId: string;
            leftAt: Date | null;
        })[];
        actions: ({
            assignedUser: {
                name: string;
                id: string;
            } | null;
        } & {
            title: string;
            id: string;
            status: import("@prisma/tenant-client").$Enums.ActionStatus;
            createdAt: Date;
            assignedUserId: string | null;
            dueAt: Date | null;
            warRoomId: string;
            completedAt: Date | null;
        })[];
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.WarRoomStatus;
        createdAt: Date;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        serviceId: string | null;
        resolvedAt: Date | null;
        alertIds: string[];
        templateId: string | null;
        incidentCommanderId: string;
    }>;
    addParticipant(id: string, dto: AddParticipantDto, user: RequestUser): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        role: import("@prisma/tenant-client").$Enums.WarRoomParticipantRole;
        id: string;
        userId: string;
        joinedAt: Date;
        warRoomId: string;
        leftAt: Date | null;
    }>;
    removeParticipant(id: string, userId: string, user: RequestUser): Promise<void>;
    createAction(id: string, dto: CreateActionDto, user: RequestUser): Promise<{
        assignedUser: {
            name: string;
            id: string;
        } | null;
    } & {
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.ActionStatus;
        createdAt: Date;
        assignedUserId: string | null;
        dueAt: Date | null;
        warRoomId: string;
        completedAt: Date | null;
    }>;
    updateAction(id: string, actionId: string, dto: UpdateActionDto, user: RequestUser): Promise<{
        assignedUser: {
            name: string;
            id: string;
        } | null;
    } & {
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.ActionStatus;
        createdAt: Date;
        assignedUserId: string | null;
        dueAt: Date | null;
        warRoomId: string;
        completedAt: Date | null;
    }>;
    getTimeline(id: string): Promise<{
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        actorId: string | null;
        warRoomId: string;
    }[]>;
    addTimelineEntry(id: string, dto: AddTimelineEntryDto, user: RequestUser): Promise<{
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        actorId: string | null;
        warRoomId: string;
    }>;
}
export declare class WarRoomTemplatesController {
    private readonly service;
    constructor(service: WarRoomsService);
    findAll(): import("@prisma/tenant-client").Prisma.PrismaPromise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    create(dto: CreateTemplateDto): import("@prisma/tenant-client").Prisma.Prisma__WarRoomTemplateClient<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateTemplateDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    remove(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
}

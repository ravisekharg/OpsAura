import { WarRoomsRepository } from './war-rooms.repository';
import type { CreateWarRoomDto, UpdateWarRoomDto, AddParticipantDto, CreateActionDto, UpdateActionDto, AddTimelineEntryDto, CreateTemplateDto, UpdateTemplateDto } from './dto/war-room.dto';
export declare class WarRoomsService {
    private readonly repo;
    constructor(repo: WarRoomsRepository);
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
    create(dto: CreateWarRoomDto, commanderId: string): Promise<({
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
    update(id: string, dto: UpdateWarRoomDto, actorId: string): Promise<{
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
    resolve(id: string, actorId: string): Promise<{
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
    archive(id: string, actorId: string): Promise<{
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
    addParticipant(id: string, dto: AddParticipantDto, actorId: string): Promise<{
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
    removeParticipant(id: string, userId: string, actorId: string): Promise<void>;
    createAction(warRoomId: string, dto: CreateActionDto, actorId: string): Promise<{
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
    updateAction(warRoomId: string, actionId: string, dto: UpdateActionDto, actorId: string): Promise<{
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
    addTimelineEntry(id: string, dto: AddTimelineEntryDto, actorId: string): Promise<{
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        actorId: string | null;
        warRoomId: string;
    }>;
    findAllTemplates(): import("@prisma/tenant-client").Prisma.PrismaPromise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }[]>;
    findTemplate(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    createTemplate(dto: CreateTemplateDto): import("@prisma/tenant-client").Prisma.Prisma__WarRoomTemplateClient<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    updateTemplate(id: string, dto: UpdateTemplateDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    deleteTemplate(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
}

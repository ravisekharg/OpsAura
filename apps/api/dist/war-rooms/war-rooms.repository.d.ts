import { TenantContextService } from '../tenant/tenant-context.service';
import type { CreateWarRoomDto, UpdateWarRoomDto, AddParticipantDto, CreateActionDto, UpdateActionDto, AddTimelineEntryDto, CreateTemplateDto, UpdateTemplateDto } from './dto/war-room.dto';
export declare class WarRoomsRepository {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    private get db();
    findMany(status?: string): import("@prisma/tenant-client").Prisma.PrismaPromise<({
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
    findById(id: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomClient<({
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
    }) | null, null, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    create(dto: CreateWarRoomDto, commanderId: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomClient<{
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
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateWarRoomDto): import("@prisma/tenant-client").Prisma.Prisma__WarRoomClient<{
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
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    resolve(id: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomClient<{
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
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    archive(id: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomClient<{
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
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    findParticipant(warRoomId: string, userId: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomParticipantClient<{
        role: import("@prisma/tenant-client").$Enums.WarRoomParticipantRole;
        id: string;
        userId: string;
        joinedAt: Date;
        warRoomId: string;
        leftAt: Date | null;
    } | null, null, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    addParticipant(warRoomId: string, dto: AddParticipantDto): import("@prisma/tenant-client").Prisma.Prisma__WarRoomParticipantClient<{
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
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    removeParticipant(warRoomId: string, userId: string): import("@prisma/tenant-client").Prisma.PrismaPromise<import("@prisma/tenant-client").Prisma.BatchPayload>;
    findAction(id: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomActionClient<{
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.ActionStatus;
        createdAt: Date;
        assignedUserId: string | null;
        dueAt: Date | null;
        warRoomId: string;
        completedAt: Date | null;
    } | null, null, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    createAction(warRoomId: string, dto: CreateActionDto): import("@prisma/tenant-client").Prisma.Prisma__WarRoomActionClient<{
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
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    updateAction(id: string, dto: UpdateActionDto): import("@prisma/tenant-client").Prisma.Prisma__WarRoomActionClient<{
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
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    getTimeline(warRoomId: string): import("@prisma/tenant-client").Prisma.PrismaPromise<{
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        actorId: string | null;
        warRoomId: string;
    }[]>;
    addTimelineEntry(warRoomId: string, dto: AddTimelineEntryDto, actorId?: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomTimelineClient<{
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        actorId: string | null;
        warRoomId: string;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    findTemplates(): import("@prisma/tenant-client").Prisma.PrismaPromise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }[]>;
    findTemplate(id: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomTemplateClient<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    } | null, null, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    createTemplate(dto: CreateTemplateDto): import("@prisma/tenant-client").Prisma.Prisma__WarRoomTemplateClient<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    updateTemplate(id: string, dto: UpdateTemplateDto): import("@prisma/tenant-client").Prisma.Prisma__WarRoomTemplateClient<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    deleteTemplate(id: string): import("@prisma/tenant-client").Prisma.Prisma__WarRoomTemplateClient<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        defaultRoles: import("@prisma/tenant-client/runtime/library").JsonValue;
        defaultActions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
}

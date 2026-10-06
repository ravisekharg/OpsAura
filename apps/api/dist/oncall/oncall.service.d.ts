import { TenantContextService } from '../tenant/tenant-context.service';
import { OnCallResolverService } from '../alerts/routing/oncall-resolver.service';
import type { CreateScheduleDto, UpdateScheduleDto, CreateRotationDto, UpdateRotationDto, CreateOverrideDto } from './dto/oncall.dto';
export declare class OnCallService {
    private readonly tenantContext;
    private readonly resolver;
    constructor(tenantContext: TenantContextService, resolver: OnCallResolverService);
    private get db();
    getSchedules(): import("@prisma/tenant-client").Prisma.PrismaPromise<({
        team: {
            name: string;
            id: string;
        } | null;
        _count: {
            rotations: number;
            overrides: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        timezone: string;
    })[]>;
    getSchedule(id: string): Promise<{
        team: {
            name: string;
            id: string;
        } | null;
        _count: {
            overrides: number;
        };
        rotations: {
            type: import("@prisma/tenant-client").$Enums.RotationType;
            name: string;
            id: string;
            createdAt: Date;
            members: import("@prisma/tenant-client/runtime/library").JsonValue;
            active: boolean;
            scheduleId: string;
            handoffDay: string | null;
            handoffTime: Date | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        timezone: string;
    }>;
    createSchedule(dto: CreateScheduleDto): import("@prisma/tenant-client").Prisma.Prisma__ScheduleClient<{
        team: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        timezone: string;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    updateSchedule(id: string, dto: UpdateScheduleDto): Promise<{
        team: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        timezone: string;
    }>;
    deleteSchedule(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        timezone: string;
    }>;
    getRotations(scheduleId?: string): import("@prisma/tenant-client").Prisma.PrismaPromise<({
        schedule: {
            name: string;
            id: string;
        };
    } & {
        type: import("@prisma/tenant-client").$Enums.RotationType;
        name: string;
        id: string;
        createdAt: Date;
        members: import("@prisma/tenant-client/runtime/library").JsonValue;
        active: boolean;
        scheduleId: string;
        handoffDay: string | null;
        handoffTime: Date | null;
    })[]>;
    createRotation(dto: CreateRotationDto): import("@prisma/tenant-client").Prisma.Prisma__RotationClient<{
        schedule: {
            name: string;
            id: string;
        };
    } & {
        type: import("@prisma/tenant-client").$Enums.RotationType;
        name: string;
        id: string;
        createdAt: Date;
        members: import("@prisma/tenant-client/runtime/library").JsonValue;
        active: boolean;
        scheduleId: string;
        handoffDay: string | null;
        handoffTime: Date | null;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    updateRotation(id: string, dto: UpdateRotationDto): import("@prisma/tenant-client").Prisma.Prisma__RotationClient<{
        type: import("@prisma/tenant-client").$Enums.RotationType;
        name: string;
        id: string;
        createdAt: Date;
        members: import("@prisma/tenant-client/runtime/library").JsonValue;
        active: boolean;
        scheduleId: string;
        handoffDay: string | null;
        handoffTime: Date | null;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    deleteRotation(id: string): import("@prisma/tenant-client").Prisma.Prisma__RotationClient<{
        type: import("@prisma/tenant-client").$Enums.RotationType;
        name: string;
        id: string;
        createdAt: Date;
        members: import("@prisma/tenant-client/runtime/library").JsonValue;
        active: boolean;
        scheduleId: string;
        handoffDay: string | null;
        handoffTime: Date | null;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    getOverrides(scheduleId?: string): import("@prisma/tenant-client").Prisma.PrismaPromise<({
        schedule: {
            name: string;
            id: string;
        };
        originalUser: {
            name: string;
            id: string;
        };
        overrideUser: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        reason: string | null;
        startAt: Date;
        scheduleId: string;
        originalUserId: string;
        overrideUserId: string;
        endAt: Date;
        createdBy: string;
    })[]>;
    createOverride(dto: CreateOverrideDto, createdBy: string): import("@prisma/tenant-client").Prisma.Prisma__OverrideClient<{
        originalUser: {
            name: string;
            id: string;
        };
        overrideUser: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        reason: string | null;
        startAt: Date;
        scheduleId: string;
        originalUserId: string;
        overrideUserId: string;
        endAt: Date;
        createdBy: string;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    deleteOverride(id: string): import("@prisma/tenant-client").Prisma.Prisma__OverrideClient<{
        id: string;
        createdAt: Date;
        reason: string | null;
        startAt: Date;
        scheduleId: string;
        originalUserId: string;
        overrideUserId: string;
        endAt: Date;
        createdBy: string;
    }, never, import("@prisma/tenant-client/runtime/library").DefaultArgs>;
    currentOnCall(assignmentGroupId?: string): Promise<import("../alerts/routing/oncall-resolver.service").OnCallResult | {
        group: {
            name: string;
            id: string;
        };
        oncall: import("../alerts/routing/oncall-resolver.service").OnCallResult;
    }[]>;
    coverage(weekStart?: string): Promise<{
        weekStart: string;
        schedules: ({
            rotations: {
                type: import("@prisma/tenant-client").$Enums.RotationType;
                name: string;
                id: string;
                createdAt: Date;
                members: import("@prisma/tenant-client/runtime/library").JsonValue;
                active: boolean;
                scheduleId: string;
                handoffDay: string | null;
                handoffTime: Date | null;
            }[];
            overrides: ({
                originalUser: {
                    name: string;
                    id: string;
                };
                overrideUser: {
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                reason: string | null;
                startAt: Date;
                scheduleId: string;
                originalUserId: string;
                overrideUserId: string;
                endAt: Date;
                createdBy: string;
            })[];
        } & {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            teamId: string | null;
            active: boolean;
            timezone: string;
        })[];
    }>;
    private getWeekStart;
}

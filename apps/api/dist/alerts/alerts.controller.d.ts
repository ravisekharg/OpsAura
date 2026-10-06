import { AlertsService } from './alerts.service';
import { AlertQueryDto } from './dto/alert.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { RequestUser } from '../common/interfaces/request-user.interface';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    findAll(pagination: PaginationDto, query: AlertQueryDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        assignmentGroup: {
            name: string;
            id: string;
        } | null;
        assignedUser: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.AlertStatus;
        tags: import("@prisma/tenant-client/runtime/library").JsonValue;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        assignmentGroupId: string | null;
        serviceId: string | null;
        source: string | null;
        fingerprint: string;
        assignedUserId: string | null;
        dedupCount: number;
        correlationGroupId: string | null;
        rawPayload: import("@prisma/tenant-client/runtime/library").JsonValue | null;
        firedAt: Date;
        acknowledgedAt: Date | null;
        resolvedAt: Date | null;
    }>>;
    findOne(id: string): Promise<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        assignmentGroup: {
            name: string;
            id: string;
        } | null;
        assignedUser: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.AlertStatus;
        tags: import("@prisma/tenant-client/runtime/library").JsonValue;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        assignmentGroupId: string | null;
        serviceId: string | null;
        source: string | null;
        fingerprint: string;
        assignedUserId: string | null;
        dedupCount: number;
        correlationGroupId: string | null;
        rawPayload: import("@prisma/tenant-client/runtime/library").JsonValue | null;
        firedAt: Date;
        acknowledgedAt: Date | null;
        resolvedAt: Date | null;
    }>;
    acknowledge(id: string, user: RequestUser): Promise<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        assignmentGroup: {
            name: string;
            id: string;
        } | null;
        assignedUser: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.AlertStatus;
        tags: import("@prisma/tenant-client/runtime/library").JsonValue;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        assignmentGroupId: string | null;
        serviceId: string | null;
        source: string | null;
        fingerprint: string;
        assignedUserId: string | null;
        dedupCount: number;
        correlationGroupId: string | null;
        rawPayload: import("@prisma/tenant-client/runtime/library").JsonValue | null;
        firedAt: Date;
        acknowledgedAt: Date | null;
        resolvedAt: Date | null;
    }>;
    resolve(id: string): Promise<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        assignmentGroup: {
            name: string;
            id: string;
        } | null;
        assignedUser: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.AlertStatus;
        tags: import("@prisma/tenant-client/runtime/library").JsonValue;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        assignmentGroupId: string | null;
        serviceId: string | null;
        source: string | null;
        fingerprint: string;
        assignedUserId: string | null;
        dedupCount: number;
        correlationGroupId: string | null;
        rawPayload: import("@prisma/tenant-client/runtime/library").JsonValue | null;
        firedAt: Date;
        acknowledgedAt: Date | null;
        resolvedAt: Date | null;
    }>;
    suppress(id: string): Promise<{
        service: {
            name: string;
            id: string;
            tier: import("@prisma/tenant-client").$Enums.ServiceTier;
        } | null;
        assignmentGroup: {
            name: string;
            id: string;
        } | null;
        assignedUser: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        id: string;
        status: import("@prisma/tenant-client").$Enums.AlertStatus;
        tags: import("@prisma/tenant-client/runtime/library").JsonValue;
        severity: import("@prisma/tenant-client").$Enums.AlertSeverity;
        assignmentGroupId: string | null;
        serviceId: string | null;
        source: string | null;
        fingerprint: string;
        assignedUserId: string | null;
        dedupCount: number;
        correlationGroupId: string | null;
        rawPayload: import("@prisma/tenant-client/runtime/library").JsonValue | null;
        firedAt: Date;
        acknowledgedAt: Date | null;
        resolvedAt: Date | null;
    }>;
    getSuppressionRules(): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        active: boolean;
        matchField: string;
        matchValue: string;
        reason: string;
    }[]>;
    createSuppressionRule(body: Record<string, unknown>): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        active: boolean;
        matchField: string;
        matchValue: string;
        reason: string;
    }>;
    updateSuppressionRule(id: string, body: Record<string, unknown>): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        active: boolean;
        matchField: string;
        matchValue: string;
        reason: string;
    }>;
    getCorrelationRules(): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        active: boolean;
        matchField: string;
        matchValue: string;
        groupBy: string;
        windowMinutes: number;
    }[]>;
    createCorrelationRule(body: Record<string, unknown>): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        active: boolean;
        matchField: string;
        matchValue: string;
        groupBy: string;
        windowMinutes: number;
    }>;
    updateCorrelationRule(id: string, body: Record<string, unknown>): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        active: boolean;
        matchField: string;
        matchValue: string;
        groupBy: string;
        windowMinutes: number;
    }>;
}

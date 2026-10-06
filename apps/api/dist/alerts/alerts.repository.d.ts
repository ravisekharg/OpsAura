import { TenantContextService } from '../tenant/tenant-context.service';
import type { AlertQueryDto } from './dto/alert.dto';
import type { PaginationDto } from '../common/dto/pagination.dto';
export declare class AlertsRepository {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    private get db();
    private readonly include;
    findMany(query: AlertQueryDto & PaginationDto): Promise<{
        items: ({
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
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
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
    }) | null>;
    findByFingerprint(fingerprint: string, windowMinutes: number): Promise<{
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
    } | null>;
    incrementDedupCount(id: string): Promise<{
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
    create(data: {
        title: string;
        description?: string;
        severity: string;
        status: string;
        serviceId?: string;
        source?: string;
        assignmentGroupId?: string;
        assignedUserId?: string;
        tags: string[];
        fingerprint: string;
        correlationGroupId?: string;
        rawPayload?: Record<string, unknown>;
    }): Promise<{
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
    acknowledge(id: string, userId: string): Promise<{
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
    findActiveSuppressionRules(): Promise<{
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
    createSuppressionRule(data: {
        name: string;
        description?: string;
        matchField: string;
        matchValue: string;
        reason: string;
        expiresAt?: Date;
    }): Promise<{
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
    findSuppressionRules(): Promise<{
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
    updateSuppressionRule(id: string, data: Record<string, unknown>): Promise<{
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
    findActiveCorrelationRules(): Promise<{
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
    findCorrelationRules(): Promise<{
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
    createCorrelationRule(data: Record<string, unknown>): Promise<{
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
    updateCorrelationRule(id: string, data: Record<string, unknown>): Promise<{
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

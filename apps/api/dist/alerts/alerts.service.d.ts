import { TenantContextService } from '../tenant/tenant-context.service';
import { AlertsRepository } from './alerts.repository';
import { DedupService } from './dedup/dedup.service';
import { SuppressionService } from './suppression/suppression.service';
import { CorrelationService } from './correlation/correlation.service';
import { RoutingEngineService } from './routing/routing-engine.service';
import { OnCallResolverService } from './routing/oncall-resolver.service';
import type { NormalizedAlert } from './dto/ingest.dto';
import type { AlertQueryDto } from './dto/alert.dto';
import type { PaginationDto } from '../common/dto/pagination.dto';
export interface AlertIngestionResult {
    alert: Record<string, unknown>;
    action: 'created' | 'deduplicated' | 'suppressed';
    assignmentGroup: string | null;
    onCall: {
        userId: string | null;
        userName: string | null;
        scheduleName: string | null;
        isOverride: boolean;
    };
}
export declare class AlertsService {
    private readonly repo;
    private readonly dedup;
    private readonly suppression;
    private readonly correlation;
    private readonly routingEngine;
    private readonly oncallResolver;
    private readonly tenantContext;
    private readonly logger;
    constructor(repo: AlertsRepository, dedup: DedupService, suppression: SuppressionService, correlation: CorrelationService, routingEngine: RoutingEngineService, oncallResolver: OnCallResolverService, tenantContext: TenantContextService);
    ingest(normalized: NormalizedAlert): Promise<AlertIngestionResult>;
    findAll(query: AlertQueryDto & PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
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
    createSuppressionRule(data: Record<string, unknown>): Promise<{
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
    private resolveServiceId;
}

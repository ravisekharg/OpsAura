import { AlertsRepository } from '../alerts.repository';
export declare class DedupService {
    private readonly repo;
    private readonly logger;
    constructor(repo: AlertsRepository);
    generateFingerprint(title: string, source?: string, serviceName?: string): string;
    checkDuplicate(fingerprint: string, windowMinutes?: number): Promise<{
        isDuplicate: boolean;
        alert: {
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
        };
    } | {
        isDuplicate: boolean;
        alert: null;
    }>;
}

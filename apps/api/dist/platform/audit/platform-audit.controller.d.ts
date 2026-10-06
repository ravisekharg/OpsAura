import { PlatformPrismaService } from '../../database/platform-prisma.service';
declare class PlatformAuditQueryDto {
    tenantId?: string;
    action?: string;
    actorEmail?: string;
    page?: number;
    limit?: number;
}
export declare class PlatformAuditController {
    private readonly platformDb;
    constructor(platformDb: PlatformPrismaService);
    findAll(q: PlatformAuditQueryDto): Promise<{
        data: ({
            tenant: {
                name: string;
                slug: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            action: string;
            ipAddress: string | null;
            actorEmail: string | null;
            target: string | null;
            detail: string | null;
            actorId: string | null;
            tenantId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
export {};

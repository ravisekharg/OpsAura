import { PlatformPrismaService } from '../../database/platform-prisma.service';
export declare class BillingController {
    private readonly platformDb;
    constructor(platformDb: PlatformPrismaService);
    overview(): Promise<{
        activeTenants: number;
        activeSubscriptions: number;
        trialingSubscriptions: number;
        mrr: number;
        plans: {
            id: string;
            name: string;
            tenantCount: number;
            priceMonthly: import("@prisma/platform-client/runtime/library").Decimal | null;
        }[];
        subscriptionBreakdown: {
            status: import("@prisma/platform-client").$Enums.SubscriptionStatus;
            count: number;
        }[];
    }>;
    allSubscriptions(status?: string): Promise<({
        tenant: {
            name: string;
            id: string;
            slug: string;
        };
        plan: {
            name: string;
            id: string;
            priceMonthly: import("@prisma/platform-client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import("@prisma/platform-client").$Enums.SubscriptionStatus;
        tenantId: string;
        planId: string;
        billingCycle: import("@prisma/platform-client").$Enums.BillingCycle;
        startsAt: Date;
        endsAt: Date | null;
    })[]>;
}

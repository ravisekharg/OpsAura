import { PlatformPrismaService } from '../../database/platform-prisma.service';
export declare class TenantsRepository {
    private readonly db;
    constructor(db: PlatformPrismaService);
    private readonly include;
    findMany(search?: string, status?: string): Promise<({
        plan: {
            name: string;
            id: string;
        } | null;
        _count: {
            subscriptions: number;
        };
        subscriptions: {
            id: string;
            status: import("@prisma/platform-client").$Enums.SubscriptionStatus;
            billingCycle: import("@prisma/platform-client").$Enums.BillingCycle;
            startsAt: Date;
            endsAt: Date | null;
        }[];
    } & {
        domain: string | null;
        name: string;
        id: string;
        status: import("@prisma/platform-client").$Enums.TenantStatus;
        createdAt: Date;
        slug: string;
        dbName: string;
        planId: string | null;
        suspendedAt: Date | null;
    })[]>;
    findById(id: string): Promise<({
        plan: {
            name: string;
            id: string;
        } | null;
        _count: {
            subscriptions: number;
        };
        subscriptions: {
            id: string;
            status: import("@prisma/platform-client").$Enums.SubscriptionStatus;
            billingCycle: import("@prisma/platform-client").$Enums.BillingCycle;
            startsAt: Date;
            endsAt: Date | null;
        }[];
    } & {
        domain: string | null;
        name: string;
        id: string;
        status: import("@prisma/platform-client").$Enums.TenantStatus;
        createdAt: Date;
        slug: string;
        dbName: string;
        planId: string | null;
        suspendedAt: Date | null;
    }) | null>;
    findBySlug(slug: string): Promise<({
        plan: {
            name: string;
            id: string;
        } | null;
        _count: {
            subscriptions: number;
        };
        subscriptions: {
            id: string;
            status: import("@prisma/platform-client").$Enums.SubscriptionStatus;
            billingCycle: import("@prisma/platform-client").$Enums.BillingCycle;
            startsAt: Date;
            endsAt: Date | null;
        }[];
    } & {
        domain: string | null;
        name: string;
        id: string;
        status: import("@prisma/platform-client").$Enums.TenantStatus;
        createdAt: Date;
        slug: string;
        dbName: string;
        planId: string | null;
        suspendedAt: Date | null;
    }) | null>;
    update(id: string, data: Record<string, unknown>): Promise<{
        plan: {
            name: string;
            id: string;
        } | null;
        _count: {
            subscriptions: number;
        };
        subscriptions: {
            id: string;
            status: import("@prisma/platform-client").$Enums.SubscriptionStatus;
            billingCycle: import("@prisma/platform-client").$Enums.BillingCycle;
            startsAt: Date;
            endsAt: Date | null;
        }[];
    } & {
        domain: string | null;
        name: string;
        id: string;
        status: import("@prisma/platform-client").$Enums.TenantStatus;
        createdAt: Date;
        slug: string;
        dbName: string;
        planId: string | null;
        suspendedAt: Date | null;
    }>;
    suspend(id: string): Promise<{
        plan: {
            name: string;
            id: string;
        } | null;
        _count: {
            subscriptions: number;
        };
        subscriptions: {
            id: string;
            status: import("@prisma/platform-client").$Enums.SubscriptionStatus;
            billingCycle: import("@prisma/platform-client").$Enums.BillingCycle;
            startsAt: Date;
            endsAt: Date | null;
        }[];
    } & {
        domain: string | null;
        name: string;
        id: string;
        status: import("@prisma/platform-client").$Enums.TenantStatus;
        createdAt: Date;
        slug: string;
        dbName: string;
        planId: string | null;
        suspendedAt: Date | null;
    }>;
}

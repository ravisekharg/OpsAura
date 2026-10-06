import { PlatformPrismaService } from '../../database/platform-prisma.service';
import type { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/platform.dto';
export declare class SubscriptionsRepository {
    private readonly db;
    constructor(db: PlatformPrismaService);
    private readonly include;
    findAll(tenantId?: string): import("@prisma/platform-client").Prisma.PrismaPromise<({
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
    findById(id: string): import("@prisma/platform-client").Prisma.Prisma__SubscriptionClient<({
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
    }) | null, null, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    findActiveByTenant(tenantId: string): import("@prisma/platform-client").Prisma.Prisma__SubscriptionClient<({
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
    }) | null, null, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    create(data: CreateSubscriptionDto): import("@prisma/platform-client").Prisma.Prisma__SubscriptionClient<{
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
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateSubscriptionDto): import("@prisma/platform-client").Prisma.Prisma__SubscriptionClient<{
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
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    cancel(id: string): import("@prisma/platform-client").Prisma.Prisma__SubscriptionClient<{
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
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
}

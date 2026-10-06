import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/platform.dto';
export declare class SubscriptionsController {
    private readonly service;
    constructor(service: SubscriptionsService);
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
    findOne(id: string): Promise<{
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
    }>;
    create(dto: CreateSubscriptionDto): import("@prisma/platform-client").Prisma.Prisma__SubscriptionClient<{
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
    update(id: string, dto: UpdateSubscriptionDto): Promise<{
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
    }>;
    cancel(id: string): Promise<{
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
    }>;
}

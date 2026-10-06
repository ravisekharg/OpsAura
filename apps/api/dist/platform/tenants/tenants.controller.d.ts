import { TenantsService } from './tenants.service';
import { ProvisionTenantDto, UpdateTenantDto } from '../dto/platform.dto';
import type { RequestUser } from '../../common/interfaces/request-user.interface';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    findAll(search?: string, status?: string): Promise<({
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
    findOne(id: string): Promise<{
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
    provision(dto: ProvisionTenantDto, user: RequestUser): Promise<import("../provisioning/tenant-provisioner.service").ProvisionResult>;
    update(id: string, dto: UpdateTenantDto): Promise<{
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

import { TenantsRepository } from './tenants.repository';
import { TenantProvisionerService } from '../provisioning/tenant-provisioner.service';
import type { ProvisionTenantDto, UpdateTenantDto } from '../dto/platform.dto';
export declare class TenantsService {
    private readonly repo;
    private readonly provisioner;
    constructor(repo: TenantsRepository, provisioner: TenantProvisionerService);
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
    findBySlug(slug: string): Promise<{
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
    provision(dto: ProvisionTenantDto, actorId: string, actorEmail: string): Promise<import("../provisioning/tenant-provisioner.service").ProvisionResult>;
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

import { ServicesRepository } from './services.repository';
import { PlanLimitsService } from '../subscription-enforcement/plan-limits.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import type { CreateServiceDto, UpdateServiceDto, SetOwnershipDto } from './dto/service.dto';
export declare class ServicesService {
    private readonly repo;
    private readonly planLimits;
    private readonly tenantContext;
    constructor(repo: ServicesRepository, planLimits: PlanLimitsService, tenantContext: TenantContextService);
    findAll(search?: string): Promise<({
        team: {
            name: string;
            id: string;
        } | null;
        ownership: ({
            assignmentGroup: {
                name: string;
                id: string;
            } | null;
            primaryUser: {
                name: string;
                email: string;
                id: string;
            } | null;
            secondaryUser: {
                name: string;
                email: string;
                id: string;
            } | null;
        } & {
            id: string;
            primaryUserId: string | null;
            secondaryUserId: string | null;
            assignmentGroupId: string | null;
            serviceId: string;
            updatedAt: Date;
        }) | null;
    } & {
        name: string;
        description: string | null;
        id: string;
        status: import("@prisma/tenant-client").$Enums.ServiceStatus;
        createdAt: Date;
        teamId: string | null;
        tier: import("@prisma/tenant-client").$Enums.ServiceTier;
    })[]>;
    findOne(id: string): Promise<{
        team: {
            name: string;
            id: string;
        } | null;
        ownership: ({
            assignmentGroup: {
                name: string;
                id: string;
            } | null;
            primaryUser: {
                name: string;
                email: string;
                id: string;
            } | null;
            secondaryUser: {
                name: string;
                email: string;
                id: string;
            } | null;
        } & {
            id: string;
            primaryUserId: string | null;
            secondaryUserId: string | null;
            assignmentGroupId: string | null;
            serviceId: string;
            updatedAt: Date;
        }) | null;
    } & {
        name: string;
        description: string | null;
        id: string;
        status: import("@prisma/tenant-client").$Enums.ServiceStatus;
        createdAt: Date;
        teamId: string | null;
        tier: import("@prisma/tenant-client").$Enums.ServiceTier;
    }>;
    create(dto: CreateServiceDto): Promise<{
        team: {
            name: string;
            id: string;
        } | null;
        ownership: ({
            assignmentGroup: {
                name: string;
                id: string;
            } | null;
            primaryUser: {
                name: string;
                email: string;
                id: string;
            } | null;
            secondaryUser: {
                name: string;
                email: string;
                id: string;
            } | null;
        } & {
            id: string;
            primaryUserId: string | null;
            secondaryUserId: string | null;
            assignmentGroupId: string | null;
            serviceId: string;
            updatedAt: Date;
        }) | null;
    } & {
        name: string;
        description: string | null;
        id: string;
        status: import("@prisma/tenant-client").$Enums.ServiceStatus;
        createdAt: Date;
        teamId: string | null;
        tier: import("@prisma/tenant-client").$Enums.ServiceTier;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        team: {
            name: string;
            id: string;
        } | null;
        ownership: ({
            assignmentGroup: {
                name: string;
                id: string;
            } | null;
            primaryUser: {
                name: string;
                email: string;
                id: string;
            } | null;
            secondaryUser: {
                name: string;
                email: string;
                id: string;
            } | null;
        } & {
            id: string;
            primaryUserId: string | null;
            secondaryUserId: string | null;
            assignmentGroupId: string | null;
            serviceId: string;
            updatedAt: Date;
        }) | null;
    } & {
        name: string;
        description: string | null;
        id: string;
        status: import("@prisma/tenant-client").$Enums.ServiceStatus;
        createdAt: Date;
        teamId: string | null;
        tier: import("@prisma/tenant-client").$Enums.ServiceTier;
    }>;
    remove(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        status: import("@prisma/tenant-client").$Enums.ServiceStatus;
        createdAt: Date;
        teamId: string | null;
        tier: import("@prisma/tenant-client").$Enums.ServiceTier;
    }>;
    getOwnership(serviceId: string): Promise<({
        assignmentGroup: {
            name: string;
            id: string;
        } | null;
        primaryUser: {
            name: string;
            email: string;
            id: string;
        } | null;
        secondaryUser: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        primaryUserId: string | null;
        secondaryUserId: string | null;
        assignmentGroupId: string | null;
        serviceId: string;
        updatedAt: Date;
    }) | null>;
    setOwnership(serviceId: string, dto: SetOwnershipDto): Promise<{
        assignmentGroup: {
            name: string;
            id: string;
        } | null;
        primaryUser: {
            name: string;
            email: string;
            id: string;
        } | null;
        secondaryUser: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        primaryUserId: string | null;
        secondaryUserId: string | null;
        assignmentGroupId: string | null;
        serviceId: string;
        updatedAt: Date;
    }>;
}

import { TenantContextService } from '../tenant/tenant-context.service';
import type { CreateServiceDto, UpdateServiceDto, SetOwnershipDto } from './dto/service.dto';
export declare class ServicesRepository {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    private get db();
    private readonly include;
    findMany(search?: string): Promise<({
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
    findById(id: string): Promise<({
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
    }) | null>;
    create(data: CreateServiceDto): Promise<{
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
    update(id: string, data: UpdateServiceDto): Promise<{
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
    delete(id: string): Promise<{
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
    upsertOwnership(serviceId: string, data: SetOwnershipDto): Promise<{
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

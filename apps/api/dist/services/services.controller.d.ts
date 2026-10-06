import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto, SetOwnershipDto } from './dto/service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
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
    getOwnership(id: string): Promise<({
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
    setOwnership(id: string, dto: SetOwnershipDto): Promise<{
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

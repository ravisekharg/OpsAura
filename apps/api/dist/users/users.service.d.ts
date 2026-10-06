import { UsersRepository } from './users.repository';
import { PlanLimitsService } from '../subscription-enforcement/plan-limits.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import type { InviteUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto';
import type { PaginationDto } from '../common/dto/pagination.dto';
export declare class UsersService {
    private readonly repo;
    private readonly planLimits;
    private readonly tenantContext;
    private readonly logger;
    constructor(repo: UsersRepository, planLimits: PlanLimitsService, tenantContext: TenantContextService);
    findAll(query: UserQueryDto & PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        role: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            isSystem: boolean;
        };
        teamMemberships: ({
            team: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                leadUserId: string | null;
            };
        } & {
            userId: string;
            teamId: string;
            joinedAt: Date;
        })[];
    } & {
        name: string;
        email: string;
        id: string;
        passwordHash: string | null;
        roleId: string;
        status: import("@prisma/tenant-client").$Enums.UserStatus;
        mfaSecret: string | null;
        mfaEnabled: boolean;
        avatarUrl: string | null;
        forcePasswordChange: boolean;
        lastLoginAt: Date | null;
        invitedBy: string | null;
        createdAt: Date;
    }>>;
    findOne(id: string): Promise<{
        role: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            isSystem: boolean;
        };
        teamMemberships: ({
            team: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                leadUserId: string | null;
            };
        } & {
            userId: string;
            teamId: string;
            joinedAt: Date;
        })[];
    } & {
        name: string;
        email: string;
        id: string;
        passwordHash: string | null;
        roleId: string;
        status: import("@prisma/tenant-client").$Enums.UserStatus;
        mfaSecret: string | null;
        mfaEnabled: boolean;
        avatarUrl: string | null;
        forcePasswordChange: boolean;
        lastLoginAt: Date | null;
        invitedBy: string | null;
        createdAt: Date;
    }>;
    invite(dto: InviteUserDto, invitedById: string): Promise<{
        role: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            isSystem: boolean;
        };
    } & {
        name: string;
        email: string;
        id: string;
        passwordHash: string | null;
        roleId: string;
        status: import("@prisma/tenant-client").$Enums.UserStatus;
        mfaSecret: string | null;
        mfaEnabled: boolean;
        avatarUrl: string | null;
        forcePasswordChange: boolean;
        lastLoginAt: Date | null;
        invitedBy: string | null;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        role: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            isSystem: boolean;
        };
    } & {
        name: string;
        email: string;
        id: string;
        passwordHash: string | null;
        roleId: string;
        status: import("@prisma/tenant-client").$Enums.UserStatus;
        mfaSecret: string | null;
        mfaEnabled: boolean;
        avatarUrl: string | null;
        forcePasswordChange: boolean;
        lastLoginAt: Date | null;
        invitedBy: string | null;
        createdAt: Date;
    }>;
    deactivate(id: string): Promise<{
        name: string;
        email: string;
        id: string;
        passwordHash: string | null;
        roleId: string;
        status: import("@prisma/tenant-client").$Enums.UserStatus;
        mfaSecret: string | null;
        mfaEnabled: boolean;
        avatarUrl: string | null;
        forcePasswordChange: boolean;
        lastLoginAt: Date | null;
        invitedBy: string | null;
        createdAt: Date;
    }>;
    resendInvite(id: string): Promise<{
        message: string;
    }>;
}

import { UsersService } from './users.service';
import { InviteUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto';
import type { RequestUser } from '../common/interfaces/request-user.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: UserQueryDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
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
    invite(dto: InviteUserDto, user: RequestUser): Promise<{
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

import { TenantContextService } from '../tenant/tenant-context.service';
import type { UserQueryDto } from './dto/user.dto';
export declare class UsersRepository {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    private get db();
    findMany(query: UserQueryDto & {
        page: number;
        limit: number;
    }): Promise<{
        items: ({
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
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
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
    }) | null>;
    findByEmail(email: string): Promise<({
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
    }) | null>;
    create(data: {
        name: string;
        email: string;
        roleId: string;
        passwordHash?: string;
        invitedBy?: string;
    }): Promise<{
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
    update(id: string, data: Record<string, unknown>): Promise<{
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
    findRoleByName(name: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        isSystem: boolean;
    } | null>;
    createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        tokenHash: string;
        usedAt: Date | null;
    }>;
}

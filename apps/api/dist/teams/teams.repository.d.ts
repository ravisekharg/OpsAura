import { TenantContextService } from '../tenant/tenant-context.service';
import type { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
export declare class TeamsRepository {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    private get db();
    findMany(search?: string): Promise<({
        _count: {
            members: number;
            services: number;
        };
        lead: {
            name: string;
            email: string;
            id: string;
        } | null;
        members: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            userId: string;
            teamId: string;
            joinedAt: Date;
        })[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        leadUserId: string | null;
    })[]>;
    findById(id: string): Promise<({
        _count: {
            members: number;
            services: number;
        };
        lead: {
            name: string;
            email: string;
            id: string;
        } | null;
        members: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            userId: string;
            teamId: string;
            joinedAt: Date;
        })[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        leadUserId: string | null;
    }) | null>;
    create(data: CreateTeamDto): Promise<{
        _count: {
            members: number;
        };
        lead: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        leadUserId: string | null;
    }>;
    update(id: string, data: UpdateTeamDto): Promise<{
        _count: {
            members: number;
        };
        lead: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        leadUserId: string | null;
    }>;
    delete(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        leadUserId: string | null;
    }>;
    addMember(teamId: string, userId: string): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
    removeMember(teamId: string, userId: string): Promise<{
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
    isMember(teamId: string, userId: string): Promise<boolean>;
}

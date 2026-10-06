import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, AddMemberDto } from './dto/team.dto';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    findAll(search?: string): Promise<({
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
    findOne(id: string): Promise<{
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
    }>;
    create(dto: CreateTeamDto): Promise<{
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
    update(id: string, dto: UpdateTeamDto): Promise<{
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
    remove(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        leadUserId: string | null;
    }>;
    addMember(id: string, dto: AddMemberDto): Promise<{
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
    removeMember(id: string, userId: string): Promise<{
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
}

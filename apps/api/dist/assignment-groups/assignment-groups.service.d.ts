import { AssignmentGroupsRepository } from './assignment-groups.repository';
import type { CreateAssignmentGroupDto, UpdateAssignmentGroupDto, CreateRoutingRuleDto, UpdateRoutingRuleDto, ReorderRuleDto } from './dto/assignment-group.dto';
export declare class AssignmentGroupsService {
    private readonly repo;
    constructor(repo: AssignmentGroupsRepository);
    findAllGroups(search?: string): Promise<({
        team: {
            name: string;
            id: string;
        } | null;
        escalationPolicy: {
            name: string;
            id: string;
        } | null;
        _count: {
            serviceOwnerships: number;
            routingRules: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        oncallPolicy: string | null;
        escalationPolicyId: string | null;
    })[]>;
    findOneGroup(id: string): Promise<{
        team: {
            name: string;
            id: string;
        } | null;
        escalationPolicy: {
            name: string;
            id: string;
        } | null;
        _count: {
            serviceOwnerships: number;
            routingRules: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        oncallPolicy: string | null;
        escalationPolicyId: string | null;
    }>;
    createGroup(dto: CreateAssignmentGroupDto): Promise<{
        team: {
            name: string;
            id: string;
        } | null;
        escalationPolicy: {
            name: string;
            id: string;
        } | null;
        _count: {
            serviceOwnerships: number;
            routingRules: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        oncallPolicy: string | null;
        escalationPolicyId: string | null;
    }>;
    updateGroup(id: string, dto: UpdateAssignmentGroupDto): Promise<{
        team: {
            name: string;
            id: string;
        } | null;
        escalationPolicy: {
            name: string;
            id: string;
        } | null;
        _count: {
            serviceOwnerships: number;
            routingRules: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        oncallPolicy: string | null;
        escalationPolicyId: string | null;
    }>;
    removeGroup(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        oncallPolicy: string | null;
        escalationPolicyId: string | null;
    }>;
    findAllRules(): Promise<({
        assignmentGroup: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    })[]>;
    findOneRule(id: string): Promise<{
        assignmentGroup: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    createRule(dto: CreateRoutingRuleDto): Promise<{
        assignmentGroup: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    updateRule(id: string, dto: UpdateRoutingRuleDto): Promise<{
        assignmentGroup: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    removeRule(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    reorderRules(rules: ReorderRuleDto[]): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }[]>;
}

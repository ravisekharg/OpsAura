import { TenantContextService } from '../tenant/tenant-context.service';
import type { CreateAssignmentGroupDto, UpdateAssignmentGroupDto, CreateRoutingRuleDto, UpdateRoutingRuleDto } from './dto/assignment-group.dto';
export declare class AssignmentGroupsRepository {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    private get db();
    private readonly groupInclude;
    findGroups(search?: string): Promise<({
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
    findGroupById(id: string): Promise<({
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
    }) | null>;
    createGroup(data: CreateAssignmentGroupDto): Promise<{
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
    updateGroup(id: string, data: UpdateAssignmentGroupDto): Promise<{
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
    deleteGroup(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        oncallPolicy: string | null;
        escalationPolicyId: string | null;
    }>;
    findRules(): Promise<({
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
    findRuleById(id: string): Promise<({
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
    }) | null>;
    createRule(data: CreateRoutingRuleDto): Promise<{
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
    updateRule(id: string, data: UpdateRoutingRuleDto): Promise<{
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
    deleteRule(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
    reorderRules(rules: Array<{
        id: string;
        priority: number;
    }>): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }[]>;
}

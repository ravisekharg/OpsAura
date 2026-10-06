import { AssignmentGroupsService } from './assignment-groups.service';
import { CreateAssignmentGroupDto, UpdateAssignmentGroupDto, CreateRoutingRuleDto, UpdateRoutingRuleDto, ReorderRuleDto } from './dto/assignment-group.dto';
export declare class AssignmentGroupsController {
    private readonly service;
    constructor(service: AssignmentGroupsService);
    findAll(search?: string): Promise<({
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
    findOne(id: string): Promise<{
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
    create(dto: CreateAssignmentGroupDto): Promise<{
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
    update(id: string, dto: UpdateAssignmentGroupDto): Promise<{
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
    remove(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        teamId: string | null;
        active: boolean;
        oncallPolicy: string | null;
        escalationPolicyId: string | null;
    }>;
}
export declare class RoutingRulesController {
    private readonly service;
    constructor(service: AssignmentGroupsService);
    findAll(): Promise<({
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
    findOne(id: string): Promise<{
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
    create(dto: CreateRoutingRuleDto): Promise<{
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
    reorder(rules: ReorderRuleDto[]): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }[]>;
    update(id: string, dto: UpdateRoutingRuleDto): Promise<{
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
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        assignmentGroupId: string;
        priority: number;
        conditions: import("@prisma/tenant-client/runtime/library").JsonValue;
    }>;
}

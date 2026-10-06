import { RoutingRulesService } from './routing-rules.service';
import { CreateRoutingRuleDto, UpdateRoutingRuleDto, ReorderRoutingRulesDto } from './dto/routing-rule.dto';
export declare class RoutingRulesController {
    private readonly service;
    constructor(service: RoutingRulesService);
    findAll(assignmentGroupId?: string): import("@prisma/tenant-client").Prisma.PrismaPromise<({
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
    reorder(dto: ReorderRoutingRulesDto): Promise<({
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
    test(payload: Record<string, any>): Promise<{
        matched: boolean;
        rule: {
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
        };
        assignmentGroup: {
            name: string;
            id: string;
        };
    } | {
        matched: boolean;
        rule: null;
        assignmentGroup: null;
    }>;
}

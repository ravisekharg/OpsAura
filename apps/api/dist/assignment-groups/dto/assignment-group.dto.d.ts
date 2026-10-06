export declare class CreateAssignmentGroupDto {
    name: string;
    description?: string;
    teamId?: string;
    oncallPolicy?: string;
    escalationPolicyId?: string;
    active?: boolean;
}
export declare class UpdateAssignmentGroupDto {
    name?: string;
    description?: string;
    teamId?: string;
    oncallPolicy?: string;
    escalationPolicyId?: string;
    active?: boolean;
}
export declare class RuleConditionDto {
    field: string;
    operator: string;
    value: string;
}
export declare class CreateRoutingRuleDto {
    name: string;
    priority: number;
    conditions: RuleConditionDto[];
    assignmentGroupId: string;
    active?: boolean;
}
export declare class UpdateRoutingRuleDto {
    name?: string;
    priority?: number;
    conditions?: RuleConditionDto[];
    assignmentGroupId?: string;
    active?: boolean;
}
export declare class ReorderRuleDto {
    id: string;
    priority: number;
}

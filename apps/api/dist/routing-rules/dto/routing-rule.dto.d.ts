export declare class RuleConditionDto {
    field: string;
    operator: string;
    value: string | string[];
}
export declare class CreateRoutingRuleDto {
    name: string;
    priority: number;
    conditions: RuleConditionDto[];
    assignmentGroupId: string;
    active?: boolean;
}
declare const UpdateRoutingRuleDto_base: import("@nestjs/common").Type<Partial<CreateRoutingRuleDto>>;
export declare class UpdateRoutingRuleDto extends UpdateRoutingRuleDto_base {
}
export declare class ReorderRoutingRulesDto {
    rules: {
        id: string;
        priority: number;
    }[];
}
export {};

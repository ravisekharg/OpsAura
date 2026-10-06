export declare class PlatformLoginDto {
    email: string;
    password: string;
}
export declare class ProvisionTenantDto {
    slug: string;
    name: string;
    adminEmail: string;
    adminName: string;
    planId?: string;
    domain?: string;
}
export declare class UpdateTenantDto {
    name?: string;
    status?: string;
    planId?: string;
}
export declare class CreatePlanDto {
    name: string;
    features?: Record<string, unknown>;
    limits?: Record<string, unknown>;
    priceMonthly?: number;
}
export declare class UpdatePlanDto {
    name?: string;
    features?: Record<string, unknown>;
    limits?: Record<string, unknown>;
    priceMonthly?: number;
}
export declare class CreateSubscriptionDto {
    tenantId: string;
    planId: string;
    billingCycle?: string;
}
export declare class UpdateSubscriptionDto {
    status?: string;
    planId?: string;
    billingCycle?: string;
}
export declare class CreateFeatureFlagDto {
    name: string;
    enabled?: boolean;
}
export declare class SetTenantOverrideDto {
    tenantId: string;
    enabled: boolean;
}
export declare class AddDomainDto {
    tenantId: string;
    domain: string;
}

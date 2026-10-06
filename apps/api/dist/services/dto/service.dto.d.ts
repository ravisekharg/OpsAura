export declare enum ServiceTier {
    P0 = "P0",
    P1 = "P1",
    P2 = "P2",
    P3 = "P3"
}
export declare enum ServiceStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class CreateServiceDto {
    name: string;
    description?: string;
    teamId?: string;
    tier?: ServiceTier;
    status?: ServiceStatus;
}
export declare class UpdateServiceDto {
    name?: string;
    description?: string;
    teamId?: string;
    tier?: ServiceTier;
    status?: ServiceStatus;
}
export declare class SetOwnershipDto {
    primaryUserId?: string;
    secondaryUserId?: string;
    assignmentGroupId?: string;
}

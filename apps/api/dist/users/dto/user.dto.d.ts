export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    INVITED = "INVITED",
    SUSPENDED = "SUSPENDED"
}
export declare class InviteUserDto {
    name: string;
    email: string;
    roleName: string;
}
export declare class UpdateUserDto {
    name?: string;
    roleName?: string;
    status?: UserStatus;
}
export declare class UserQueryDto {
    search?: string;
    status?: UserStatus;
    roleName?: string;
    page?: number;
    limit?: number;
}

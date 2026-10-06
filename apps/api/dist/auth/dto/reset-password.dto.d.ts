export declare class RequestPasswordResetDto {
    email: string;
    tenantSlug: string;
}
export declare class ConfirmPasswordResetDto {
    token: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

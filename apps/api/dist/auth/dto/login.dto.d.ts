export declare class LoginDto {
    email: string;
    password: string;
    tenantSlug?: string;
}
export declare class MfaVerifyDto {
    mfaToken: string;
    code: string;
}

declare const ApiKeyOrJwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class ApiKeyOrJwtGuard extends ApiKeyOrJwtGuard_base {
    handleRequest<TUser = any>(err: any, user: TUser): TUser;
}
export {};

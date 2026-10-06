import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const PLATFORM_ROLES: readonly ["super_admin", "admin", "support_admin", "billing_admin", "read_only"];
export type PlatformRole = (typeof PLATFORM_ROLES)[number];
export declare const PLATFORM_ROLE_KEY = "requiredPlatformRoles";
export declare const RequirePlatformRole: (...roles: PlatformRole[]) => {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare class PlatformGuard implements CanActivate {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}

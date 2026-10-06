import type { Permission } from '../../common/constants/permissions.constants';
export declare const PERMISSIONS_KEY = "requiredPermissions";
export declare const RequirePermission: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;

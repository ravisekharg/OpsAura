import { TenantContextService } from '../tenant/tenant-context.service';
import type { Permission } from '../common/constants/permissions.constants';
export declare class RbacService {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    getPermissionsForRole(roleName: string): Promise<Permission[]>;
    seedRolesAndPermissions(): Promise<void>;
    private seedRolePermissions;
}

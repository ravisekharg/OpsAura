import { TenantContextService } from '../tenant/tenant-context.service';
export declare class RolesController {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    findAll(): Promise<({
        rolePermissions: ({
            permission: {
                description: string | null;
                id: string;
                resource: string;
                action: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        isSystem: boolean;
    })[]>;
}

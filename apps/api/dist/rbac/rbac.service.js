"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const permissions_constants_1 = require("../common/constants/permissions.constants");
let RbacService = class RbacService {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
    }
    async getPermissionsForRole(roleName) {
        const db = this.tenantContext.getDb();
        const role = await db.role.findUnique({
            where: { name: roleName },
            include: {
                rolePermissions: { include: { permission: true } },
            },
        });
        if (!role)
            return [];
        if (role.rolePermissions.length > 0) {
            return role.rolePermissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`);
        }
        const normalizedRole = roleName.toLowerCase().replace(/ /g, '_');
        return (permissions_constants_1.ROLE_PERMISSIONS[normalizedRole] ?? []);
    }
    async seedRolesAndPermissions() {
        const db = this.tenantContext.getDb();
        const allPermissions = [];
        for (const perm of Object.values(permissions_constants_1.ROLE_PERMISSIONS).flat()) {
            const [resource, action] = perm.split(':');
            if (!allPermissions.find((p) => p.resource === resource && p.action === action)) {
                allPermissions.push({ resource, action });
            }
        }
        for (const perm of allPermissions) {
            await db.permission.upsert({
                where: { resource_action: perm },
                create: perm,
                update: {},
            });
        }
        const roleNames = Object.keys(permissions_constants_1.ROLE_PERMISSIONS);
        for (const roleName of roleNames) {
            await db.role.upsert({
                where: { name: roleName },
                create: { name: roleName, isSystem: true },
                update: {},
            });
        }
        this.seedRolePermissions(db, allPermissions);
    }
    async seedRolePermissions(db, allPermissions) {
        for (const [roleName, permissions] of Object.entries(permissions_constants_1.ROLE_PERMISSIONS)) {
            const role = await db.role.findUnique({ where: { name: roleName } });
            if (!role)
                continue;
            for (const perm of permissions) {
                const [resource, action] = perm.split(':');
                const permission = allPermissions.find((p) => p.resource === resource && p.action === action);
                if (!permission)
                    continue;
                const dbPerm = await db.permission.findUnique({
                    where: { resource_action: permission },
                });
                if (!dbPerm)
                    continue;
                await db.rolePermission.upsert({
                    where: { roleId_permissionId: { roleId: role.id, permissionId: dbPerm.id } },
                    create: { roleId: role.id, permissionId: dbPerm.id },
                    update: {},
                });
            }
        }
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], RbacService);
//# sourceMappingURL=rbac.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRolesAndPermissions = seedRolesAndPermissions;
const permissions_constants_1 = require("../../common/constants/permissions.constants");
async function seedRolesAndPermissions(db) {
    const allPerms = new Map();
    for (const perms of Object.values(permissions_constants_1.ROLE_PERMISSIONS)) {
        for (const perm of perms) {
            const [resource, action] = perm.split(':');
            allPerms.set(perm, { resource, action });
        }
    }
    for (const perm of allPerms.values()) {
        await db.permission.upsert({
            where: { resource_action: perm },
            create: perm,
            update: {},
        });
    }
    for (const roleName of Object.keys(permissions_constants_1.ROLE_PERMISSIONS)) {
        await db.role.upsert({
            where: { name: roleName },
            create: { name: roleName, isSystem: true },
            update: {},
        });
    }
    for (const [roleName, perms] of Object.entries(permissions_constants_1.ROLE_PERMISSIONS)) {
        const role = await db.role.findUnique({ where: { name: roleName } });
        if (!role)
            continue;
        for (const permStr of perms) {
            const [resource, action] = permStr.split(':');
            const permission = await db.permission.findUnique({
                where: { resource_action: { resource, action } },
            });
            if (!permission)
                continue;
            await db.rolePermission.upsert({
                where: {
                    roleId_permissionId: { roleId: role.id, permissionId: permission.id },
                },
                create: { roleId: role.id, permissionId: permission.id },
                update: {},
            });
        }
    }
}
//# sourceMappingURL=roles.seed.js.map
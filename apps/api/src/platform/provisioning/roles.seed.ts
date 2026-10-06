import { PrismaClient } from '@prisma/tenant-client'
import { ROLE_PERMISSIONS } from '../../common/constants/permissions.constants'

export async function seedRolesAndPermissions(db: PrismaClient): Promise<void> {
  // Collect all unique permissions
  const allPerms = new Map<string, { resource: string; action: string }>()

  for (const perms of Object.values(ROLE_PERMISSIONS)) {
    for (const perm of perms as string[]) {
      const [resource, action] = perm.split(':')
      allPerms.set(perm, { resource, action })
    }
  }

  // Upsert permissions
  for (const perm of allPerms.values()) {
    await db.permission.upsert({
      where: { resource_action: perm },
      create: perm,
      update: {},
    })
  }

  // Upsert roles
  for (const roleName of Object.keys(ROLE_PERMISSIONS)) {
    await db.role.upsert({
      where: { name: roleName },
      create: { name: roleName, isSystem: true },
      update: {},
    })
  }

  // Upsert role_permissions
  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await db.role.findUnique({ where: { name: roleName } })
    if (!role) continue

    for (const permStr of perms as string[]) {
      const [resource, action] = permStr.split(':')
      const permission = await db.permission.findUnique({
        where: { resource_action: { resource, action } },
      })
      if (!permission) continue

      await db.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: permission.id },
        },
        create: { roleId: role.id, permissionId: permission.id },
        update: {},
      })
    }
  }
}

import { Injectable } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import { ROLE_PERMISSIONS } from '../common/constants/permissions.constants'
import type { Permission } from '../common/constants/permissions.constants'

@Injectable()
export class RbacService {
  constructor(private readonly tenantContext: TenantContextService) {}

  async getPermissionsForRole(roleName: string): Promise<Permission[]> {
    const db = this.tenantContext.getDb()

    const role = await db.role.findUnique({
      where: { name: roleName },
      include: {
        rolePermissions: { include: { permission: true } },
      },
    })

    if (!role) return []

    // If DB has custom permissions for this role, use those
    if (role.rolePermissions.length > 0) {
      return role.rolePermissions.map(
        (rp) => `${rp.permission.resource}:${rp.permission.action}` as Permission,
      )
    }

    // Fall back to static constants for system roles
    const normalizedRole = roleName.toLowerCase().replace(/ /g, '_')
    return (ROLE_PERMISSIONS[normalizedRole] ?? []) as Permission[]
  }

  async seedRolesAndPermissions(): Promise<void> {
    const db = this.tenantContext.getDb()

    const allPermissions: Array<{ resource: string; action: string }> = []

    for (const perm of Object.values(ROLE_PERMISSIONS).flat()) {
      const [resource, action] = (perm as string).split(':')
      if (!allPermissions.find((p) => p.resource === resource && p.action === action)) {
        allPermissions.push({ resource, action })
      }
    }

    // Upsert all permissions
    for (const perm of allPermissions) {
      await db.permission.upsert({
        where: { resource_action: perm },
        create: perm,
        update: {},
      })
    }

    // Upsert all system roles
    const roleNames = Object.keys(ROLE_PERMISSIONS)
    for (const roleName of roleNames) {
      await db.role.upsert({
        where: { name: roleName },
        create: { name: roleName, isSystem: true },
        update: {},
      })
    }

    this.seedRolePermissions(db, allPermissions)
  }

  private async seedRolePermissions(db: ReturnType<TenantContextService['getDb']>, allPermissions: Array<{ resource: string; action: string }>) {
    for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const role = await db.role.findUnique({ where: { name: roleName } })
      if (!role) continue

      for (const perm of permissions as string[]) {
        const [resource, action] = perm.split(':')
        const permission = allPermissions.find(
          (p) => p.resource === resource && p.action === action,
        )
        if (!permission) continue

        const dbPerm = await db.permission.findUnique({
          where: { resource_action: permission },
        })
        if (!dbPerm) continue

        await db.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: dbPerm.id } },
          create: { roleId: role.id, permissionId: dbPerm.id },
          update: {},
        })
      }
    }
  }
}

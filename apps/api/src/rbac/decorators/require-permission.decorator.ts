import { SetMetadata } from '@nestjs/common'
import type { Permission } from '../../common/constants/permissions.constants'

export const PERMISSIONS_KEY = 'requiredPermissions'

export const RequirePermission = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)

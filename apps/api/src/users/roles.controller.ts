import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RequirePermission } from '../rbac/decorators/require-permission.decorator'
import { PERMISSIONS } from '../common/constants/permissions.constants'
import { TenantContextService } from '../tenant/tenant-context.service'

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly tenantContext: TenantContextService) {}

  @Get()
  @RequirePermission(PERMISSIONS.USERS_VIEW)
  @ApiOperation({ summary: 'List all roles with their permissions' })
  async findAll() {
    const db = this.tenantContext.getDb()
    return db.role.findMany({
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
      orderBy: { name: 'asc' },
    })
  }
}

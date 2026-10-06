import { Injectable } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import type { InviteUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto'

@Injectable()
export class UsersRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() {
    return this.tenantContext.getDb()
  }

  async findMany(query: UserQueryDto & { page: number; limit: number }) {
    const { search, status, roleName, page, limit } = query
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status) where.status = status
    if (roleName) where.role = { name: roleName }

    const [items, total] = await Promise.all([
      this.db.user.findMany({
        where,
        skip,
        take: limit,
        include: { role: true, teamMemberships: { include: { team: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.db.user.count({ where }),
    ])

    return { items, total }
  }

  async findById(id: string) {
    return this.db.user.findUnique({
      where: { id },
      include: { role: true, teamMemberships: { include: { team: true } } },
    })
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
      include: { role: true },
    })
  }

  async create(data: {
    name: string
    email: string
    roleId: string
    passwordHash?: string
    invitedBy?: string
  }) {
    return this.db.user.create({
      data: {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        passwordHash: data.passwordHash,
        status: 'INVITED',
        forcePasswordChange: true,
        invitedBy: data.invitedBy,
      },
      include: { role: true },
    })
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.db.user.update({
      where: { id },
      data: data as any,
      include: { role: true },
    })
  }

  async deactivate(id: string) {
    return this.db.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  async findRoleByName(name: string) {
    return this.db.role.findUnique({ where: { name } })
  }

  async createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
    return this.db.passwordResetToken.create({
      data: { userId, tokenHash, expiresAt },
    })
  }
}

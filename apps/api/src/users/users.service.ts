import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import * as crypto from 'crypto'
import { UsersRepository } from './users.repository'
import { PlanLimitsService } from '../subscription-enforcement/plan-limits.service'
import { TenantContextService } from '../tenant/tenant-context.service'
import { paginate } from '../common/dto/pagination.dto'
import type { InviteUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto'
import type { PaginationDto } from '../common/dto/pagination.dto'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    private readonly repo: UsersRepository,
    private readonly planLimits: PlanLimitsService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async findAll(query: UserQueryDto & PaginationDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 50
    const { items, total } = await this.repo.findMany({ ...query, page, limit })
    return paginate(items, total, page, limit)
  }

  async findOne(id: string) {
    const user = await this.repo.findById(id)
    if (!user) throw new NotFoundException(`User ${id} not found`)
    return user
  }

  async invite(dto: InviteUserDto, invitedById: string) {
    // Enforce plan user limit before creating
    await this.planLimits.enforceLimit('users', this.tenantContext.getTenantSlug())

    const existing = await this.repo.findByEmail(dto.email)
    if (existing) throw new ConflictException('A user with that email already exists')

    const role = await this.repo.findRoleByName(dto.roleName)
    if (!role) throw new BadRequestException(`Role '${dto.roleName}' not found`)

    const user = await this.repo.create({
      name: dto.name,
      email: dto.email,
      roleId: role.id,
      invitedBy: invitedById,
    })

    // Create password reset token (the invite link)
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await this.repo.createPasswordResetToken(user.id, tokenHash, expiresAt)

    // TODO: dispatch invite email via notification service
    this.logger.log(`Invite token for ${user.email}: ${token.slice(0, 12)}...`)

    return user
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id)

    const patch: Record<string, unknown> = {}
    if (dto.name) patch.name = dto.name
    if (dto.status) patch.status = dto.status

    if (dto.roleName) {
      const role = await this.repo.findRoleByName(dto.roleName)
      if (!role) throw new BadRequestException(`Role '${dto.roleName}' not found`)
      patch.roleId = role.id
    }

    return this.repo.update(id, patch)
  }

  async deactivate(id: string) {
    await this.findOne(id)
    return this.repo.deactivate(id)
  }

  async resendInvite(id: string) {
    const user = await this.findOne(id)
    if (user.status !== 'INVITED') {
      throw new BadRequestException('User is not in invited status')
    }

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await this.repo.createPasswordResetToken(user.id, tokenHash, expiresAt)

    this.logger.log(`Resent invite for ${user.email}`)
    return { message: 'Invite resent' }
  }
}

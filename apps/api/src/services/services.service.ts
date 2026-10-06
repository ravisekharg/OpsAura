import { Injectable, NotFoundException } from '@nestjs/common'
import { ServicesRepository } from './services.repository'
import { PlanLimitsService } from '../subscription-enforcement/plan-limits.service'
import { TenantContextService } from '../tenant/tenant-context.service'
import type { CreateServiceDto, UpdateServiceDto, SetOwnershipDto } from './dto/service.dto'

@Injectable()
export class ServicesService {
  constructor(
    private readonly repo: ServicesRepository,
    private readonly planLimits: PlanLimitsService,
    private readonly tenantContext: TenantContextService,
  ) {}

  findAll(search?: string) { return this.repo.findMany(search) }

  async findOne(id: string) {
    const service = await this.repo.findById(id)
    if (!service) throw new NotFoundException(`Service ${id} not found`)
    return service
  }

  async create(dto: CreateServiceDto) {
    await this.planLimits.enforceLimit('services', this.tenantContext.getTenantSlug())
    return this.repo.create(dto)
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id)
    return this.repo.update(id, dto)
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.repo.delete(id)
  }

  async getOwnership(serviceId: string) {
    await this.findOne(serviceId)
    return this.repo.getOwnership(serviceId)
  }

  async setOwnership(serviceId: string, dto: SetOwnershipDto) {
    await this.findOne(serviceId)
    return this.repo.upsertOwnership(serviceId, dto)
  }
}

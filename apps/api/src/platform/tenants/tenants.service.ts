import { Injectable, NotFoundException } from '@nestjs/common'
import { TenantsRepository } from './tenants.repository'
import { TenantProvisionerService } from '../provisioning/tenant-provisioner.service'
import type { ProvisionTenantDto, UpdateTenantDto } from '../dto/platform.dto'

@Injectable()
export class TenantsService {
  constructor(
    private readonly repo: TenantsRepository,
    private readonly provisioner: TenantProvisionerService,
  ) {}

  findAll(search?: string, status?: string) {
    return this.repo.findMany(search, status)
  }

  async findOne(id: string) {
    const tenant = await this.repo.findById(id)
    if (!tenant) throw new NotFoundException(`Tenant ${id} not found`)
    return tenant
  }

  async findBySlug(slug: string) {
    const tenant = await this.repo.findBySlug(slug)
    if (!tenant) throw new NotFoundException(`Tenant "${slug}" not found`)
    return tenant
  }

  async provision(dto: ProvisionTenantDto, actorId: string, actorEmail: string) {
    return this.provisioner.provision(dto, actorId, actorEmail)
  }

  async update(id: string, dto: UpdateTenantDto) {
    await this.findOne(id)
    return this.repo.update(id, dto as Record<string, unknown>)
  }

  async suspend(id: string) {
    await this.findOne(id)
    return this.repo.suspend(id)
  }
}

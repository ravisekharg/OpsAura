import { Injectable, NotFoundException } from '@nestjs/common'
import { FeatureFlagsRepository } from './feature-flags.repository'
import type { CreateFeatureFlagDto, SetTenantOverrideDto } from '../dto/platform.dto'

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly repo: FeatureFlagsRepository) {}

  findAll() { return this.repo.findAll() }

  async findOne(id: string) {
    const flag = await this.repo.findById(id)
    if (!flag) throw new NotFoundException(`Feature flag ${id} not found`)
    return flag
  }

  create(dto: CreateFeatureFlagDto) { return this.repo.create(dto) }

  async toggle(id: string, enabled: boolean) {
    await this.findOne(id)
    return this.repo.toggle(id, enabled)
  }

  async setTenantOverride(id: string, dto: SetTenantOverrideDto) {
    await this.findOne(id)
    return this.repo.setTenantOverride(id, dto)
  }

  async removeTenantOverride(id: string, tenantId: string) {
    await this.findOne(id)
    return this.repo.removeTenantOverride(id, tenantId)
  }

  isEnabledForTenant(flagName: string, tenantId: string) {
    return this.repo.isEnabledForTenant(flagName, tenantId)
  }
}

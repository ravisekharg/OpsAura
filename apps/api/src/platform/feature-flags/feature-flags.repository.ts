import { Injectable } from '@nestjs/common'
import { PlatformPrismaService } from '../../database/platform-prisma.service'
import type { CreateFeatureFlagDto, SetTenantOverrideDto } from '../dto/platform.dto'

@Injectable()
export class FeatureFlagsRepository {
  constructor(private readonly db: PlatformPrismaService) {}

  findAll() {
    return this.db.featureFlag.findMany({
      include: { overrides: { include: { tenant: { select: { id: true, slug: true, name: true } } } } },
      orderBy: { name: 'asc' },
    })
  }

  findById(id: string) {
    return this.db.featureFlag.findUnique({
      where: { id },
      include: { overrides: { include: { tenant: { select: { id: true, slug: true, name: true } } } } },
    })
  }

  create(data: CreateFeatureFlagDto) {
    return this.db.featureFlag.create({
      data: { name: data.name, enabled: data.enabled ?? false },
    })
  }

  toggle(id: string, enabled: boolean) {
    return this.db.featureFlag.update({ where: { id }, data: { enabled } })
  }

  async setTenantOverride(flagId: string, dto: SetTenantOverrideDto) {
    return this.db.featureFlagOverride.upsert({
      where: { flagId_tenantId: { flagId, tenantId: dto.tenantId } },
      create: { flagId, tenantId: dto.tenantId, enabled: dto.enabled },
      update: { enabled: dto.enabled },
    })
  }

  async removeTenantOverride(flagId: string, tenantId: string) {
    return this.db.featureFlagOverride.deleteMany({ where: { flagId, tenantId } })
  }

  async isEnabledForTenant(flagName: string, tenantId: string): Promise<boolean> {
    const flag = await this.db.featureFlag.findUnique({
      where: { name: flagName },
      include: { overrides: { where: { tenantId } } },
    })
    if (!flag) return false
    if (flag.overrides.length > 0) return flag.overrides[0].enabled
    return flag.enabled
  }
}

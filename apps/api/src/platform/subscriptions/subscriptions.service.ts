import { Injectable, NotFoundException } from '@nestjs/common'
import { SubscriptionsRepository } from './subscriptions.repository'
import type { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/platform.dto'

@Injectable()
export class SubscriptionsService {
  constructor(private readonly repo: SubscriptionsRepository) {}

  findAll(tenantId?: string) { return this.repo.findAll(tenantId) }

  async findOne(id: string) {
    const sub = await this.repo.findById(id)
    if (!sub) throw new NotFoundException(`Subscription ${id} not found`)
    return sub
  }

  findActiveByTenant(tenantId: string) {
    return this.repo.findActiveByTenant(tenantId)
  }

  create(dto: CreateSubscriptionDto) { return this.repo.create(dto) }

  async update(id: string, dto: UpdateSubscriptionDto) {
    await this.findOne(id)
    return this.repo.update(id, dto)
  }

  async cancel(id: string) {
    await this.findOne(id)
    return this.repo.cancel(id)
  }
}

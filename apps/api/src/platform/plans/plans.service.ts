import { Injectable, NotFoundException } from '@nestjs/common'
import { PlansRepository } from './plans.repository'
import type { CreatePlanDto, UpdatePlanDto } from '../dto/platform.dto'

@Injectable()
export class PlansService {
  constructor(private readonly repo: PlansRepository) {}

  findAll() { return this.repo.findAll() }

  async findOne(id: string) {
    const plan = await this.repo.findById(id)
    if (!plan) throw new NotFoundException(`Plan ${id} not found`)
    return plan
  }

  create(dto: CreatePlanDto) { return this.repo.create(dto) }

  async update(id: string, dto: UpdatePlanDto) {
    await this.findOne(id)
    return this.repo.update(id, dto)
  }
}

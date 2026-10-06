import { Injectable, NotFoundException } from '@nestjs/common'
import { AssignmentGroupsRepository } from './assignment-groups.repository'
import type {
  CreateAssignmentGroupDto,
  UpdateAssignmentGroupDto,
  CreateRoutingRuleDto,
  UpdateRoutingRuleDto,
  ReorderRuleDto,
} from './dto/assignment-group.dto'

@Injectable()
export class AssignmentGroupsService {
  constructor(private readonly repo: AssignmentGroupsRepository) {}

  // ─── Groups ─────────────────────────────────────────────────────────────────

  findAllGroups(search?: string) {
    return this.repo.findGroups(search)
  }

  async findOneGroup(id: string) {
    const group = await this.repo.findGroupById(id)
    if (!group) throw new NotFoundException(`Assignment group ${id} not found`)
    return group
  }

  createGroup(dto: CreateAssignmentGroupDto) {
    return this.repo.createGroup(dto)
  }

  async updateGroup(id: string, dto: UpdateAssignmentGroupDto) {
    await this.findOneGroup(id)
    return this.repo.updateGroup(id, dto)
  }

  async removeGroup(id: string) {
    await this.findOneGroup(id)
    return this.repo.deleteGroup(id)
  }

  // ─── Routing Rules ───────────────────────────────────────────────────────────

  findAllRules() {
    return this.repo.findRules()
  }

  async findOneRule(id: string) {
    const rule = await this.repo.findRuleById(id)
    if (!rule) throw new NotFoundException(`Routing rule ${id} not found`)
    return rule
  }

  createRule(dto: CreateRoutingRuleDto) {
    return this.repo.createRule(dto)
  }

  async updateRule(id: string, dto: UpdateRoutingRuleDto) {
    await this.findOneRule(id)
    return this.repo.updateRule(id, dto)
  }

  async removeRule(id: string) {
    await this.findOneRule(id)
    return this.repo.deleteRule(id)
  }

  reorderRules(rules: ReorderRuleDto[]) {
    return this.repo.reorderRules(rules)
  }
}

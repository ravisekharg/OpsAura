import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import type { CreateRoutingRuleDto, UpdateRoutingRuleDto, ReorderRoutingRulesDto } from './dto/routing-rule.dto'

const RULE_INCLUDE = {
  assignmentGroup: { select: { id: true, name: true } },
}

@Injectable()
export class RoutingRulesService {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() { return this.tenantContext.getDb() }

  findAll(assignmentGroupId?: string) {
    return this.db.routingRule.findMany({
      where: assignmentGroupId ? { assignmentGroupId } : {},
      include: RULE_INCLUDE,
      orderBy: { priority: 'asc' },
    })
  }

  async findOne(id: string) {
    const rule = await this.db.routingRule.findUnique({ where: { id }, include: RULE_INCLUDE })
    if (!rule) throw new NotFoundException(`Routing rule ${id} not found`)
    return rule
  }

  async create(dto: CreateRoutingRuleDto) {
    const conflict = await this.db.routingRule.findFirst({
      where: { priority: dto.priority, active: true },
    })
    if (conflict) throw new ConflictException(`Priority ${dto.priority} is already in use by rule "${conflict.name}"`)
    return this.db.routingRule.create({
      data: {
        name: dto.name,
        priority: dto.priority,
        conditions: dto.conditions as any,
        assignmentGroupId: dto.assignmentGroupId,
        active: dto.active ?? true,
      },
      include: RULE_INCLUDE,
    })
  }

  async update(id: string, dto: UpdateRoutingRuleDto) {
    await this.findOne(id)
    if (dto.priority) {
      const conflict = await this.db.routingRule.findFirst({
        where: { priority: dto.priority, active: true, NOT: { id } },
      })
      if (conflict) throw new ConflictException(`Priority ${dto.priority} is already in use`)
    }
    return this.db.routingRule.update({ where: { id }, data: dto as any, include: RULE_INCLUDE })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.db.routingRule.delete({ where: { id } })
  }

  async reorder(dto: ReorderRoutingRulesDto) {
    await this.db.$transaction(
      dto.rules.map(({ id, priority }) =>
        this.db.routingRule.update({ where: { id }, data: { priority } }),
      ),
    )
    return this.findAll()
  }

  async testRule(alertPayload: Record<string, any>) {
    const rules = await this.db.routingRule.findMany({
      where: { active: true },
      include: RULE_INCLUDE,
      orderBy: { priority: 'asc' },
    })

    for (const rule of rules) {
      const conditions = rule.conditions as any[]
      const matched = conditions.every((c) => this.evalCondition(c, alertPayload))
      if (matched) {
        return { matched: true, rule, assignmentGroup: rule.assignmentGroup }
      }
    }
    return { matched: false, rule: null, assignmentGroup: null }
  }

  private evalCondition(condition: any, payload: Record<string, any>): boolean {
    const fieldValue = String(payload[condition.field] ?? '')
    const val = condition.value
    switch (condition.operator) {
      case 'equals': return fieldValue === val
      case 'contains': return fieldValue.includes(val)
      case 'starts_with': return fieldValue.startsWith(val)
      case 'ends_with': return fieldValue.endsWith(val)
      case 'matches_regex': return new RegExp(val).test(fieldValue)
      case 'in': return Array.isArray(val) && val.includes(fieldValue)
      default: return false
    }
  }
}

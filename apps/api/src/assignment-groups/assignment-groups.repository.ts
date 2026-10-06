import { Injectable } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import type {
  CreateAssignmentGroupDto,
  UpdateAssignmentGroupDto,
  CreateRoutingRuleDto,
  UpdateRoutingRuleDto,
} from './dto/assignment-group.dto'

@Injectable()
export class AssignmentGroupsRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() {
    return this.tenantContext.getDb()
  }

  private readonly groupInclude = {
    team: { select: { id: true, name: true } },
    escalationPolicy: { select: { id: true, name: true } },
    _count: { select: { serviceOwnerships: true, routingRules: true } },
  }

  // ─── Assignment Groups ──────────────────────────────────────────────────────

  async findGroups(search?: string) {
    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {}

    return this.db.assignmentGroup.findMany({
      where,
      include: this.groupInclude,
      orderBy: { name: 'asc' },
    })
  }

  async findGroupById(id: string) {
    return this.db.assignmentGroup.findUnique({
      where: { id },
      include: this.groupInclude,
    })
  }

  async createGroup(data: CreateAssignmentGroupDto) {
    return this.db.assignmentGroup.create({
      data: {
        name: data.name,
        description: data.description,
        teamId: data.teamId ?? null,
        oncallPolicy: data.oncallPolicy,
        escalationPolicyId: data.escalationPolicyId ?? null,
        active: data.active ?? true,
      },
      include: this.groupInclude,
    })
  }

  async updateGroup(id: string, data: UpdateAssignmentGroupDto) {
    return this.db.assignmentGroup.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        teamId: data.teamId,
        oncallPolicy: data.oncallPolicy,
        escalationPolicyId: data.escalationPolicyId,
        active: data.active,
      },
      include: this.groupInclude,
    })
  }

  async deleteGroup(id: string) {
    return this.db.assignmentGroup.delete({ where: { id } })
  }

  // ─── Routing Rules ──────────────────────────────────────────────────────────

  async findRules() {
    return this.db.routingRule.findMany({
      include: {
        assignmentGroup: { select: { id: true, name: true } },
      },
      orderBy: { priority: 'asc' },
    })
  }

  async findRuleById(id: string) {
    return this.db.routingRule.findUnique({
      where: { id },
      include: { assignmentGroup: { select: { id: true, name: true } } },
    })
  }

  async createRule(data: CreateRoutingRuleDto) {
    return this.db.routingRule.create({
      data: {
        name: data.name,
        priority: data.priority,
        conditions: data.conditions as unknown as never,
        assignmentGroupId: data.assignmentGroupId,
        active: data.active ?? true,
      },
      include: { assignmentGroup: { select: { id: true, name: true } } },
    })
  }

  async updateRule(id: string, data: UpdateRoutingRuleDto) {
    return this.db.routingRule.update({
      where: { id },
      data: {
        name: data.name,
        priority: data.priority,
        conditions: data.conditions as unknown as never,
        assignmentGroupId: data.assignmentGroupId,
        active: data.active,
      },
      include: { assignmentGroup: { select: { id: true, name: true } } },
    })
  }

  async deleteRule(id: string) {
    return this.db.routingRule.delete({ where: { id } })
  }

  async reorderRules(rules: Array<{ id: string; priority: number }>) {
    return this.db.$transaction(
      rules.map((r) =>
        this.db.routingRule.update({
          where: { id: r.id },
          data: { priority: r.priority },
        }),
      ),
    )
  }
}

import { Injectable, Logger } from '@nestjs/common'
import { TenantContextService } from '../../tenant/tenant-context.service'
import type { NormalizedAlert } from '../dto/ingest.dto'

type RuleCondition = {
  field: string
  operator: string
  value: string
}

type RoutingRule = {
  id: string
  name: string
  priority: number
  conditions: unknown
  assignmentGroupId: string
  active: boolean
}

@Injectable()
export class RoutingEngineService {
  private readonly logger = new Logger(RoutingEngineService.name)

  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() {
    return this.tenantContext.getDb()
  }

  async resolveAssignmentGroup(alert: NormalizedAlert): Promise<string | null> {
    const rules = await this.db.routingRule.findMany({
      where: { active: true },
      orderBy: { priority: 'asc' },
    })

    for (const rule of rules) {
      const conditions = rule.conditions as RuleCondition[]

      if (!Array.isArray(conditions) || conditions.length === 0) continue

      const allMatch = conditions.every((cond) => this.evaluateCondition(alert, cond))

      if (allMatch) {
        this.logger.debug(
          `Alert matched routing rule "${rule.name}" (priority=${rule.priority}) → group=${rule.assignmentGroupId}`,
        )
        return rule.assignmentGroupId
      }
    }

    // No routing rule matched — try default assignment group from settings
    const defaultGroupId = await this.getDefaultAssignmentGroupId()
    if (defaultGroupId) {
      this.logger.debug(`No routing rule matched. Using default group=${defaultGroupId}`)
      return defaultGroupId
    }

    this.logger.warn('No routing rule matched and no default assignment group configured')
    return null
  }

  private evaluateCondition(alert: NormalizedAlert, cond: RuleCondition): boolean {
    const field = cond.field?.toLowerCase()
    const operator = cond.operator?.toLowerCase()
    const expected = cond.value?.toLowerCase()

    const actual = this.extractFieldValue(alert, field)
    if (actual === null) return false

    switch (operator) {
      case 'equals':
        return actual === expected

      case 'contains':
        return actual.includes(expected)

      case 'starts_with':
        return actual.startsWith(expected)

      case 'in': {
        const list = expected.split(',').map((v) => v.trim())
        return list.includes(actual)
      }

      default:
        this.logger.warn(`Unknown routing condition operator: ${operator}`)
        return false
    }
  }

  private extractFieldValue(alert: NormalizedAlert, field: string): string | null {
    switch (field) {
      case 'service':
        return alert.serviceName?.toLowerCase() ?? null

      case 'severity':
        return alert.severity.toLowerCase()

      case 'source':
        return alert.source.toLowerCase()

      case 'tag':
        // For tag field: returns first tag (use 'in' operator for multi-tag matching)
        return alert.tags[0]?.toLowerCase() ?? null

      case 'region':
        // Region extracted from tags prefixed with "region:"
        return (
          alert.tags
            .find((t) => t.toLowerCase().startsWith('region:'))
            ?.split(':')[1]
            ?.toLowerCase() ?? null
        )

      default:
        return null
    }
  }

  private async getDefaultAssignmentGroupId(): Promise<string | null> {
    const setting = await this.db.setting.findUnique({
      where: { key: 'alerts.defaultAssignmentGroupId' },
    })
    if (!setting) return null
    const value = setting.value as { groupId?: string }
    return value?.groupId ?? null
  }
}

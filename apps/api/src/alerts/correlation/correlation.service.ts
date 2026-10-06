import { Injectable, Logger } from '@nestjs/common'
import * as crypto from 'crypto'
import { AlertsRepository } from '../alerts.repository'
import type { NormalizedAlert } from '../dto/ingest.dto'

type CorrelationRule = {
  id: string
  matchField: string
  matchValue: string
  groupBy: string
  windowMinutes: number
  active: boolean
}

@Injectable()
export class CorrelationService {
  private readonly logger = new Logger(CorrelationService.name)

  constructor(private readonly repo: AlertsRepository) {}

  async resolveCorrelationGroup(alert: NormalizedAlert): Promise<string | undefined> {
    const rules = await this.repo.findActiveCorrelationRules()

    for (const rule of rules) {
      if (this.matchesRule(alert, rule)) {
        const groupKey = this.buildGroupKey(alert, rule)
        this.logger.debug(
          `Alert correlated by rule "${rule.id}" → group=${groupKey}`,
        )
        return groupKey
      }
    }

    return undefined
  }

  private matchesRule(alert: NormalizedAlert, rule: CorrelationRule): boolean {
    const field = rule.matchField.toLowerCase()
    const value = rule.matchValue.toLowerCase()

    switch (field) {
      case 'service': return alert.serviceName?.toLowerCase() === value
      case 'severity': return alert.severity.toLowerCase() === value
      case 'source': return alert.source.toLowerCase() === value
      case 'tag': return alert.tags.some((t) => t.toLowerCase() === value)
      default: return false
    }
  }

  // Build a stable correlation group ID from the groupBy field + current time window
  private buildGroupKey(alert: NormalizedAlert, rule: CorrelationRule): string {
    const windowMs = rule.windowMinutes * 60 * 1000
    const windowBucket = Math.floor(Date.now() / windowMs)
    const groupField = rule.groupBy.toLowerCase()

    let groupValue: string
    switch (groupField) {
      case 'service': groupValue = alert.serviceName ?? 'unknown'
        break
      case 'severity': groupValue = alert.severity
        break
      case 'source': groupValue = alert.source
        break
      case 'tag':
        groupValue = alert.tags[0] ?? 'unknown'
        break
      default:
        groupValue = alert.title
    }

    const raw = `${rule.id}:${groupField}:${groupValue}:${windowBucket}`
    return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16)
  }
}

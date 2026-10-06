import { Injectable, Logger } from '@nestjs/common'
import { AlertsRepository } from '../alerts.repository'
import type { NormalizedAlert } from '../dto/ingest.dto'

type SuppressionRule = {
  id: string
  matchField: string
  matchValue: string
  reason: string
  expiresAt: Date | null
  active: boolean
}

@Injectable()
export class SuppressionService {
  private readonly logger = new Logger(SuppressionService.name)

  constructor(private readonly repo: AlertsRepository) {}

  async isSuppressed(alert: NormalizedAlert): Promise<{ suppressed: boolean; reason?: string }> {
    const rules = await this.repo.findActiveSuppressionRules()

    for (const rule of rules) {
      if (this.matches(alert, rule)) {
        this.logger.debug(
          `Alert suppressed by rule "${rule.id}": ${rule.matchField}=${rule.matchValue}`,
        )
        return { suppressed: true, reason: rule.reason }
      }
    }

    return { suppressed: false }
  }

  private matches(alert: NormalizedAlert, rule: SuppressionRule): boolean {
    const field = rule.matchField.toLowerCase()
    const value = rule.matchValue.toLowerCase()

    switch (field) {
      case 'service':
        return alert.serviceName?.toLowerCase() === value

      case 'severity':
        return alert.severity.toLowerCase() === value

      case 'source':
        return alert.source.toLowerCase() === value

      case 'tag':
        return alert.tags.some((t) => t.toLowerCase() === value)

      case 'title':
        return alert.title.toLowerCase().includes(value)

      default:
        return false
    }
  }
}

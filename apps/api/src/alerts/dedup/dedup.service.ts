import { Injectable, Logger } from '@nestjs/common'
import * as crypto from 'crypto'
import { AlertsRepository } from '../alerts.repository'

const DEFAULT_DEDUP_WINDOW_MINUTES = 5

@Injectable()
export class DedupService {
  private readonly logger = new Logger(DedupService.name)

  constructor(private readonly repo: AlertsRepository) {}

  generateFingerprint(title: string, source?: string, serviceName?: string): string {
    const raw = [title, source ?? '', serviceName ?? '']
      .map((s) => s.toLowerCase().trim())
      .join('|')
    return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16)
  }

  async checkDuplicate(fingerprint: string, windowMinutes = DEFAULT_DEDUP_WINDOW_MINUTES) {
    const existing = await this.repo.findByFingerprint(fingerprint, windowMinutes)

    if (existing) {
      this.logger.debug(
        `Duplicate detected: fingerprint=${fingerprint} existing=${existing.id} count=${existing.dedupCount + 1}`,
      )
      const updated = await this.repo.incrementDedupCount(existing.id)
      return { isDuplicate: true, alert: updated }
    }

    return { isDuplicate: false, alert: null }
  }
}

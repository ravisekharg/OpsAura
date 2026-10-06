import { Injectable } from '@nestjs/common'
import type { GenericIngestDto, PrometheusWebhookDto, NormalizedAlert } from '../dto/ingest.dto'
import { DedupService } from '../dedup/dedup.service'

const SEVERITY_MAP: Record<string, NormalizedAlert['severity']> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  warning: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
  info: 'INFO',
  none: 'INFO',
}

@Injectable()
export class IngestService {
  constructor(private readonly dedup: DedupService) {}

  normalizeGeneric(dto: GenericIngestDto): NormalizedAlert {
    const severity = SEVERITY_MAP[dto.severity ?? 'medium'] ?? 'MEDIUM'
    const source = dto.source ?? 'generic'
    const fingerprint =
      dto.fingerprint ?? this.dedup.generateFingerprint(dto.title, source, dto.service)

    return {
      title: dto.title,
      description: dto.description,
      severity,
      source,
      serviceName: dto.service,
      tags: dto.tags ?? [],
      fingerprint,
      rawPayload: dto.payload ?? {},
    }
  }

  normalizePrometheus(dto: PrometheusWebhookDto): NormalizedAlert[] {
    return dto.alerts
      .filter((a) => a.status === 'firing')
      .map((a) => {
        const labels = a.labels ?? {}
        const annotations = a.annotations ?? {}

        const title = annotations.summary ?? labels.alertname ?? 'Prometheus Alert'
        const description = annotations.description
        const severity = SEVERITY_MAP[labels.severity?.toLowerCase() ?? 'medium'] ?? 'MEDIUM'
        const service = labels.service ?? labels.namespace

        const tags = Object.entries(labels)
          .filter(([k]) => !['alertname', 'severity', 'service', 'namespace'].includes(k))
          .map(([k, v]) => `${k}:${v}`)

        const fingerprint =
          a.fingerprint ?? this.dedup.generateFingerprint(title, 'prometheus', service)

        return {
          title,
          description,
          severity,
          source: 'prometheus',
          serviceName: service,
          tags,
          fingerprint,
          rawPayload: { labels, annotations, groupKey: dto.groupKey },
        }
      })
  }
}

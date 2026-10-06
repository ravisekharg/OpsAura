import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import { AlertsRepository } from './alerts.repository'
import { DedupService } from './dedup/dedup.service'
import { SuppressionService } from './suppression/suppression.service'
import { CorrelationService } from './correlation/correlation.service'
import { RoutingEngineService } from './routing/routing-engine.service'
import { OnCallResolverService } from './routing/oncall-resolver.service'
import { paginate } from '../common/dto/pagination.dto'
import type { NormalizedAlert } from './dto/ingest.dto'
import type { AlertQueryDto } from './dto/alert.dto'
import type { PaginationDto } from '../common/dto/pagination.dto'

export interface AlertIngestionResult {
  alert: Record<string, unknown>
  action: 'created' | 'deduplicated' | 'suppressed'
  assignmentGroup: string | null
  onCall: {
    userId: string | null
    userName: string | null
    scheduleName: string | null
    isOverride: boolean
  }
}

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name)

  constructor(
    private readonly repo: AlertsRepository,
    private readonly dedup: DedupService,
    private readonly suppression: SuppressionService,
    private readonly correlation: CorrelationService,
    private readonly routingEngine: RoutingEngineService,
    private readonly oncallResolver: OnCallResolverService,
    private readonly tenantContext: TenantContextService,
  ) {}

  // ─── Main Ingestion Pipeline ──────────────────────────────────────────────

  async ingest(normalized: NormalizedAlert): Promise<AlertIngestionResult> {
    this.logger.log(
      `Ingesting alert: "${normalized.title}" sev=${normalized.severity} src=${normalized.source}`,
    )

    // 1. Resolve service ID from name
    const serviceId = await this.resolveServiceId(normalized.serviceName)

    // 2. Check suppression
    const { suppressed, reason } = await this.suppression.isSuppressed(normalized)
    if (suppressed) {
      this.logger.log(`Alert suppressed: ${reason}`)
      const alert = await this.repo.create({
        ...normalized,
        status: 'SUPPRESSED',
        severity: normalized.severity,
        serviceId,
      })
      return { alert, action: 'suppressed', assignmentGroup: null, onCall: { userId: null, userName: null, scheduleName: null, isOverride: false } }
    }

    // 3. Deduplication
    const { isDuplicate, alert: existingAlert } = await this.dedup.checkDuplicate(
      normalized.fingerprint,
    )
    if (isDuplicate && existingAlert) {
      return {
        alert: existingAlert,
        action: 'deduplicated',
        assignmentGroup: (existingAlert as any).assignmentGroupId,
        onCall: { userId: null, userName: null, scheduleName: null, isOverride: false },
      }
    }

    // 4. Correlation
    const correlationGroupId = await this.correlation.resolveCorrelationGroup(normalized)

    // 5. Route to assignment group
    const assignmentGroupId = await this.routingEngine.resolveAssignmentGroup(normalized)

    // 6. Resolve on-call engineer
    let onCallResult = { userId: null as string | null, userName: null as string | null, userEmail: null as string | null, scheduleName: null as string | null, isOverride: false, rotationName: null as string | null }
    if (assignmentGroupId) {
      onCallResult = await this.oncallResolver.resolveOnCall(assignmentGroupId)
    }

    // 7. Persist alert
    const alert = await this.repo.create({
      title: normalized.title,
      description: normalized.description,
      severity: normalized.severity,
      status: 'FIRING',
      serviceId,
      source: normalized.source,
      assignmentGroupId: assignmentGroupId ?? undefined,
      assignedUserId: onCallResult.userId ?? undefined,
      tags: normalized.tags,
      fingerprint: normalized.fingerprint,
      correlationGroupId,
      rawPayload: normalized.rawPayload,
    })

    this.logger.log(
      `Alert created: id=${alert.id} group=${assignmentGroupId ?? 'none'} oncall=${onCallResult.userName ?? 'none'}`,
    )

    return {
      alert,
      action: 'created',
      assignmentGroup: assignmentGroupId,
      onCall: {
        userId: onCallResult.userId,
        userName: onCallResult.userName,
        scheduleName: onCallResult.scheduleName,
        isOverride: onCallResult.isOverride,
      },
    }
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async findAll(query: AlertQueryDto & PaginationDto) {
    const { items, total } = await this.repo.findMany(query)
    return paginate(items, total, query.page ?? 1, query.limit ?? 50)
  }

  async findOne(id: string) {
    const alert = await this.repo.findById(id)
    if (!alert) throw new NotFoundException(`Alert ${id} not found`)
    return alert
  }

  async acknowledge(id: string, userId: string) {
    await this.findOne(id)
    return this.repo.acknowledge(id, userId)
  }

  async resolve(id: string) {
    await this.findOne(id)
    return this.repo.resolve(id)
  }

  async suppress(id: string) {
    await this.findOne(id)
    return this.repo.suppress(id)
  }

  // ─── Suppression Rules ────────────────────────────────────────────────────

  getSuppressionRules() {
    return this.repo.findSuppressionRules()
  }

  createSuppressionRule(data: Record<string, unknown>) {
    return this.repo.createSuppressionRule(data as any)
  }

  updateSuppressionRule(id: string, data: Record<string, unknown>) {
    return this.repo.updateSuppressionRule(id, data)
  }

  // ─── Correlation Rules ────────────────────────────────────────────────────

  getCorrelationRules() {
    return this.repo.findCorrelationRules()
  }

  createCorrelationRule(data: Record<string, unknown>) {
    return this.repo.createCorrelationRule(data)
  }

  updateCorrelationRule(id: string, data: Record<string, unknown>) {
    return this.repo.updateCorrelationRule(id, data)
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async resolveServiceId(serviceName?: string): Promise<string | undefined> {
    if (!serviceName) return undefined
    const db = this.tenantContext.getDb()
    const service = await db.service.findFirst({
      where: { name: { equals: serviceName, mode: 'insensitive' } },
    })
    return service?.id
  }
}

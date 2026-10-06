import { Injectable } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import type { AlertQueryDto } from './dto/alert.dto'
import type { NormalizedAlert } from './dto/ingest.dto'
import type { PaginationDto } from '../common/dto/pagination.dto'

@Injectable()
export class AlertsRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() {
    return this.tenantContext.getDb()
  }

  private readonly include = {
    service: { select: { id: true, name: true, tier: true } },
    assignmentGroup: { select: { id: true, name: true } },
    assignedUser: { select: { id: true, name: true, email: true } },
  }

  async findMany(query: AlertQueryDto & PaginationDto) {
    const { status, severity, serviceId, assignmentGroupId, search, page = 1, limit = 50 } = query
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (severity) where.severity = severity
    if (serviceId) where.serviceId = serviceId
    if (assignmentGroupId) where.assignmentGroupId = assignmentGroupId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      this.db.alert.findMany({
        where,
        skip,
        take: limit,
        include: this.include,
        orderBy: [
          { severity: 'asc' },
          { firedAt: 'desc' },
        ],
      }),
      this.db.alert.count({ where }),
    ])

    return { items, total }
  }

  async findById(id: string) {
    return this.db.alert.findUnique({ where: { id }, include: this.include })
  }

  async findByFingerprint(fingerprint: string, windowMinutes: number) {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000)
    return this.db.alert.findFirst({
      where: {
        fingerprint,
        status: { in: ['FIRING', 'ACKNOWLEDGED'] },
        firedAt: { gte: since },
      },
      orderBy: { firedAt: 'desc' },
    })
  }

  async incrementDedupCount(id: string) {
    return this.db.alert.update({
      where: { id },
      data: { dedupCount: { increment: 1 } },
    })
  }

  async create(data: {
    title: string
    description?: string
    severity: string
    status: string
    serviceId?: string
    source?: string
    assignmentGroupId?: string
    assignedUserId?: string
    tags: string[]
    fingerprint: string
    correlationGroupId?: string
    rawPayload?: Record<string, unknown>
  }) {
    return this.db.alert.create({
      data: {
        title: data.title,
        description: data.description,
        severity: data.severity as any,
        status: data.status as any,
        serviceId: data.serviceId ?? null,
        source: data.source ?? null,
        assignmentGroupId: data.assignmentGroupId ?? null,
        assignedUserId: data.assignedUserId ?? null,
        tags: data.tags,
        fingerprint: data.fingerprint,
        correlationGroupId: data.correlationGroupId ?? null,
        rawPayload: (data.rawPayload ?? undefined) as any,
      },
      include: this.include,
    })
  }

  async acknowledge(id: string, userId: string) {
    return this.db.alert.update({
      where: { id },
      data: {
        status: 'ACKNOWLEDGED',
        assignedUserId: userId,
        acknowledgedAt: new Date(),
      },
      include: this.include,
    })
  }

  async resolve(id: string) {
    return this.db.alert.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
      include: this.include,
    })
  }

  async suppress(id: string) {
    return this.db.alert.update({
      where: { id },
      data: { status: 'SUPPRESSED' },
      include: this.include,
    })
  }

  // ─── Suppression Rules ──────────────────────────────────────────────────────

  async findActiveSuppressionRules() {
    return this.db.suppressionRule.findMany({
      where: {
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    })
  }

  async createSuppressionRule(data: {
    name: string
    description?: string
    matchField: string
    matchValue: string
    reason: string
    expiresAt?: Date
  }) {
    return this.db.suppressionRule.create({ data: data as any })
  }

  async findSuppressionRules() {
    return this.db.suppressionRule.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async updateSuppressionRule(id: string, data: Record<string, unknown>) {
    return this.db.suppressionRule.update({ where: { id }, data: data as any })
  }

  // ─── Correlation Rules ──────────────────────────────────────────────────────

  async findActiveCorrelationRules() {
    return this.db.correlationRule.findMany({ where: { active: true } })
  }

  async findCorrelationRules() {
    return this.db.correlationRule.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async createCorrelationRule(data: Record<string, unknown>) {
    return this.db.correlationRule.create({ data: data as any })
  }

  async updateCorrelationRule(id: string, data: Record<string, unknown>) {
    return this.db.correlationRule.update({ where: { id }, data: data as any })
  }
}

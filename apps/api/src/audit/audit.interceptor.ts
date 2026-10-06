import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request } from 'express'
import { AuditService } from './audit.service'
import { TenantContextService } from '../tenant/tenant-context.service'
import type { RequestUser } from '../common/interfaces/request-user.interface'
import type { AuditCategory, AuditSeverity } from './interfaces/audit-event.interface'

// Derives audit metadata from the HTTP method + route path
function deriveAuditMeta(
  method: string,
  path: string,
): { category: AuditCategory; action: string; severity: AuditSeverity } | null {
  const m = method.toUpperCase()
  const p = path.replace(/\/v1/, '').toLowerCase()

  // Only audit mutating operations
  if (m === 'GET') return null

  const routeMap: Array<{
    pattern: RegExp
    methods: string[]
    category: AuditCategory
    action: string
    severity?: AuditSeverity
  }> = [
    { pattern: /\/auth\/logout/, methods: ['POST'], category: 'auth', action: 'LOGOUT' },
    { pattern: /\/users\/invite/, methods: ['POST'], category: 'user', action: 'USER_INVITED' },
    { pattern: /\/users\/[^/]+$/, methods: ['PATCH'], category: 'user', action: 'USER_UPDATED' },
    { pattern: /\/users\/[^/]+$/, methods: ['DELETE'], category: 'user', action: 'USER_DEACTIVATED' },
    { pattern: /\/teams$/, methods: ['POST'], category: 'team', action: 'TEAM_CREATED' },
    { pattern: /\/teams\/[^/]+$/, methods: ['PATCH'], category: 'team', action: 'TEAM_UPDATED' },
    { pattern: /\/teams\/[^/]+$/, methods: ['DELETE'], category: 'team', action: 'TEAM_DELETED' },
    { pattern: /\/services$/, methods: ['POST'], category: 'service', action: 'SERVICE_CREATED' },
    { pattern: /\/services\/[^/]+$/, methods: ['PATCH'], category: 'service', action: 'SERVICE_UPDATED' },
    { pattern: /\/services\/[^/]+\/ownership/, methods: ['PUT'], category: 'service', action: 'OWNERSHIP_UPDATED' },
    { pattern: /\/schedules$/, methods: ['POST'], category: 'schedule', action: 'SCHEDULE_CREATED' },
    { pattern: /\/overrides$/, methods: ['POST'], category: 'schedule', action: 'OVERRIDE_CREATED' },
    { pattern: /\/overrides\/[^/]+$/, methods: ['DELETE'], category: 'schedule', action: 'OVERRIDE_DELETED' },
    { pattern: /\/alerts\/[^/]+\/acknowledge/, methods: ['POST'], category: 'alert', action: 'ALERT_ACKNOWLEDGED', severity: 'WARNING' },
    { pattern: /\/alerts\/[^/]+\/resolve/, methods: ['POST'], category: 'alert', action: 'ALERT_RESOLVED' },
    { pattern: /\/alerts\/suppression-rules$/, methods: ['POST'], category: 'alert', action: 'SUPPRESSION_RULE_CREATED', severity: 'WARNING' },
    { pattern: /\/escalations\/[^/]+\/acknowledge/, methods: ['POST'], category: 'escalation', action: 'ESCALATION_ACKNOWLEDGED' },
    { pattern: /\/escalations\/[^/]+\/resolve/, methods: ['POST'], category: 'escalation', action: 'ESCALATION_RESOLVED' },
    { pattern: /\/war-rooms$/, methods: ['POST'], category: 'war_room', action: 'WAR_ROOM_OPENED', severity: 'WARNING' },
    { pattern: /\/war-rooms\/[^/]+\/resolve/, methods: ['POST'], category: 'war_room', action: 'WAR_ROOM_RESOLVED' },
    { pattern: /\/war-rooms\/[^/]+\/participants$/, methods: ['POST'], category: 'war_room', action: 'PARTICIPANT_ADDED' },
    { pattern: /\/notification-channels/, methods: ['PUT', 'PATCH'], category: 'integration', action: 'CHANNEL_CONFIGURED', severity: 'WARNING' },
    { pattern: /\/servicenow\/connections\/[^/]+\/sync/, methods: ['POST'], category: 'integration', action: 'SERVICENOW_SYNC' },
    { pattern: /\/settings/, methods: ['PATCH'], category: 'settings', action: 'SETTINGS_UPDATED' },
    { pattern: /\/platform\/tenants$/, methods: ['POST'], category: 'tenant', action: 'TENANT_PROVISIONED', severity: 'WARNING' },
    { pattern: /\/platform\/tenants\/[^/]+$/, methods: ['PATCH'], category: 'tenant', action: 'TENANT_UPDATED' },
  ]

  for (const rule of routeMap) {
    if (rule.pattern.test(p) && rule.methods.includes(m)) {
      return {
        category: rule.category,
        action: rule.action,
        severity: rule.severity ?? 'INFO',
      }
    }
  }

  return null
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name)

  constructor(
    private readonly auditService: AuditService,
    private readonly tenantContext: TenantContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap({
        next: () => {
          this.captureAuditEvent(context)
        },
      }),
    )
  }

  private captureAuditEvent(context: ExecutionContext): void {
    try {
      const req = context.switchToHttp().getRequest<Request>()
      const user = req.user as RequestUser | undefined

      const meta = deriveAuditMeta(req.method, req.path)
      if (!meta) return

      const tenantSlug = user?.tenantSlug ?? this.safeTenantSlug()
      if (!tenantSlug) return

      const target = this.extractTarget(req)

      this.auditService.emit({
        category: meta.category,
        action: meta.action,
        severity: meta.severity,
        actorId: user?.id,
        actorEmail: user?.email,
        tenantSlug,
        target,
        detail: `${req.method} ${req.path}`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      })
    } catch (err) {
      this.logger.error('AuditInterceptor error', err)
    }
  }

  private extractTarget(req: Request): string {
    const params = req.params as Record<string, string>
    // Use the last path param (usually an ID) as the target
    const id = params.id ?? Object.values(params).pop()
    if (id) return id

    // Fall back to the last path segment
    const parts = req.path.split('/').filter(Boolean)
    return parts[parts.length - 1] ?? req.path
  }

  private safeTenantSlug(): string | undefined {
    try {
      return this.tenantContext.hasContext()
        ? this.tenantContext.getTenantSlug()
        : undefined
    } catch {
      return undefined
    }
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuditInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("./audit.service");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
function deriveAuditMeta(method, path) {
    const m = method.toUpperCase();
    const p = path.replace(/\/v1/, '').toLowerCase();
    if (m === 'GET')
        return null;
    const routeMap = [
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
    ];
    for (const rule of routeMap) {
        if (rule.pattern.test(p) && rule.methods.includes(m)) {
            return {
                category: rule.category,
                action: rule.action,
                severity: rule.severity ?? 'INFO',
            };
        }
    }
    return null;
}
let AuditInterceptor = AuditInterceptor_1 = class AuditInterceptor {
    constructor(auditService, tenantContext) {
        this.auditService = auditService;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(AuditInterceptor_1.name);
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                this.captureAuditEvent(context);
            },
        }));
    }
    captureAuditEvent(context) {
        try {
            const req = context.switchToHttp().getRequest();
            const user = req.user;
            const meta = deriveAuditMeta(req.method, req.path);
            if (!meta)
                return;
            const tenantSlug = user?.tenantSlug ?? this.safeTenantSlug();
            if (!tenantSlug)
                return;
            const target = this.extractTarget(req);
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
            });
        }
        catch (err) {
            this.logger.error('AuditInterceptor error', err);
        }
    }
    extractTarget(req) {
        const params = req.params;
        const id = params.id ?? Object.values(params).pop();
        if (id)
            return id;
        const parts = req.path.split('/').filter(Boolean);
        return parts[parts.length - 1] ?? req.path;
    }
    safeTenantSlug() {
        try {
            return this.tenantContext.hasContext()
                ? this.tenantContext.getTenantSlug()
                : undefined;
        }
        catch {
            return undefined;
        }
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = AuditInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        tenant_context_service_1.TenantContextService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map
export type AuditCategory = 'auth' | 'user' | 'team' | 'service' | 'schedule' | 'oncall' | 'alert' | 'escalation' | 'war_room' | 'integration' | 'settings' | 'tenant';
export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export interface AuditEventPayload {
    category: AuditCategory;
    action: string;
    actorId?: string;
    actorEmail?: string;
    tenantSlug: string;
    target?: string;
    detail?: string;
    severity?: AuditSeverity;
    ipAddress?: string;
    userAgent?: string;
}
export interface RouteAuditMeta {
    category: AuditCategory;
    action: string;
    severity?: AuditSeverity;
}

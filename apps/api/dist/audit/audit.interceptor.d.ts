import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditService } from './audit.service';
import { TenantContextService } from '../tenant/tenant-context.service';
export declare class AuditInterceptor implements NestInterceptor {
    private readonly auditService;
    private readonly tenantContext;
    private readonly logger;
    constructor(auditService: AuditService, tenantContext: TenantContextService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
    private captureAuditEvent;
    private extractTarget;
    private safeTenantSlug;
}

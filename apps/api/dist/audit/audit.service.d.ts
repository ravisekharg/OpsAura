import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import type { AuditEventPayload } from './interfaces/audit-event.interface';
export declare class AuditService {
    private readonly auditQueue;
    private readonly config;
    private readonly logger;
    private readonly queueName;
    constructor(auditQueue: Queue, config: ConfigService);
    emit(event: AuditEventPayload): Promise<void>;
    emitSync(event: AuditEventPayload, db: unknown): Promise<void>;
}

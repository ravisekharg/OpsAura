import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { ConfigService } from '@nestjs/config'
import type { AuditEventPayload } from './interfaces/audit-event.interface'

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name)
  private readonly queueName: string

  constructor(
    @InjectQueue('audit-events') private readonly auditQueue: Queue,
    private readonly config: ConfigService,
  ) {
    this.queueName = config.get<string>('AUDIT_QUEUE_NAME', 'audit-events')
  }

  async emit(event: AuditEventPayload): Promise<void> {
    try {
      await this.auditQueue.add('persist', event, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      })
    } catch (err) {
      // Audit failures must NEVER break the main request
      this.logger.error('Failed to enqueue audit event', err)
    }
  }

  async emitSync(event: AuditEventPayload, db: unknown): Promise<void> {
    // For critical auth events, write synchronously (no queue)
    try {
      const prisma = db as { auditEvent: { create: (args: unknown) => Promise<unknown> } }
      await prisma.auditEvent.create({
        data: {
          category: event.category,
          action: event.action,
          actorId: event.actorId,
          actorEmail: event.actorEmail,
          target: event.target,
          detail: event.detail,
          severity: event.severity ?? 'INFO',
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
        },
      })
    } catch (err) {
      this.logger.error('Failed to write sync audit event', err)
    }
  }
}

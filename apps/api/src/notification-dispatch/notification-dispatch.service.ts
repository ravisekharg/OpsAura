import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

export type NotificationChannel = 'email' | 'slack' | 'teams' | 'voice'

export interface DispatchPayload {
  tenantSlug: string
  channel: NotificationChannel
  recipient: string
  subject: string
  body?: string
  alertId?: string
  escalationId?: string
}

@Injectable()
export class NotificationDispatchService {
  private readonly logger = new Logger(NotificationDispatchService.name)

  constructor(
    @InjectQueue('notification-dispatch') private readonly queue: Queue,
  ) {}

  async dispatch(payload: DispatchPayload): Promise<void> {
    await this.queue.add('send', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    })
    this.logger.debug(`Queued ${payload.channel} → ${payload.recipient}: ${payload.subject}`)
  }

  async dispatchAlertNotification(
    tenantSlug: string,
    alertTitle: string,
    severity: string,
    channels: NotificationChannel[],
    recipients: string[],
    alertId: string,
  ): Promise<void> {
    const subject = `[${severity}] Alert: ${alertTitle}`
    for (const channel of channels) {
      for (const recipient of recipients) {
        await this.dispatch({ tenantSlug, channel, recipient, subject, alertId })
      }
    }
  }

  async dispatchEscalationNotification(
    tenantSlug: string,
    escalationTitle: string,
    stepOrder: number,
    channels: NotificationChannel[],
    recipients: string[],
    escalationId: string,
  ): Promise<void> {
    const subject = `[Escalation Step ${stepOrder}] ${escalationTitle}`
    for (const channel of channels) {
      for (const recipient of recipients) {
        await this.dispatch({ tenantSlug, channel, recipient, subject, escalationId })
      }
    }
  }
}

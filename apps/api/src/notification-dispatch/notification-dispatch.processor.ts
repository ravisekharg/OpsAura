import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { ConfigService } from '@nestjs/config'
import { TenantPrismaFactory } from '../database/tenant-prisma.factory'
import { decryptChannelConfig } from '../common/util/channel-config.util'
import type { DispatchPayload } from './notification-dispatch.service'

@Processor('notification-dispatch')
export class NotificationDispatchProcessor {
  private readonly logger = new Logger(NotificationDispatchProcessor.name)

  constructor(
    private readonly config: ConfigService,
    private readonly tenantFactory: TenantPrismaFactory,
  ) {}

  private get encKey() { return this.config.getOrThrow<string>('CHANNEL_ENCRYPTION_KEY') }

  @Process('send')
  async handleSend(job: Job<DispatchPayload>): Promise<void> {
    const { channel, tenantSlug } = job.data

    try {
      const db = this.tenantFactory.getClient(tenantSlug)
      const channelRecord = await db.notificationChannel.findFirst({
        where: { type: channel.toUpperCase() as any, connected: true },
      })

      if (!channelRecord) {
        this.logger.warn(`No connected ${channel} channel for tenant ${tenantSlug} — skipping`)
        await this.recordDelivery(tenantSlug, job.data, 'FAILED', `No connected ${channel} channel configured`)
        return
      }

      const cfg = decryptChannelConfig(channelRecord.configVaultKey, this.encKey)

      switch (channel) {
        case 'email':  await this.sendEmail(job.data, cfg); break
        case 'slack':  await this.sendSlack(job.data, cfg); break
        case 'teams':  await this.sendTeams(job.data, cfg); break
        case 'voice':  await this.sendVoice(job.data, cfg); break
        default:
          throw new Error(`Unknown channel: ${channel}`)
      }

      await this.recordDelivery(tenantSlug, job.data, 'DELIVERED', undefined, channelRecord.id)
    } catch (err) {
      this.logger.error(`[${channel}] Failed → ${job.data.recipient}: ${(err as Error).message}`)
      await this.recordDelivery(tenantSlug, job.data, 'FAILED', (err as Error).message)
      throw err
    }
  }

  // ── Email ─────────────────────────────────────────────────────────────────

  private async sendEmail(payload: DispatchPayload, cfg: any): Promise<void> {
    const nodemailer = await import('nodemailer')
    const transport = nodemailer.createTransport({
      host: cfg.host,
      port: Number(cfg.port),
      secure: cfg.tls ?? false,
      auth: { user: cfg.user, pass: cfg.password },
    })

    await transport.sendMail({
      from: cfg.from ?? `OpsAura <${cfg.user}>`,
      to: payload.recipient,
      subject: payload.subject,
      html: this.buildEmailHtml(payload),
      text: payload.body ?? payload.subject,
    })

    this.logger.log(`[EMAIL] ✓ ${payload.recipient} | ${payload.subject}`)
  }

  // ── Slack ─────────────────────────────────────────────────────────────────

  private async sendSlack(payload: DispatchPayload, cfg: any): Promise<void> {
    const axios = (await import('axios')).default
    const color = this.severityColor(payload.subject)

    await axios.post(cfg.webhookUrl, {
      ...(cfg.channel ? { channel: cfg.channel } : {}),
      attachments: [{
        color,
        fallback: payload.subject,
        title: payload.subject,
        text: payload.body ?? '',
        footer: 'OpsAura',
        ts: Math.floor(Date.now() / 1000),
        fields: [
          ...(payload.alertId ? [{ title: 'Alert ID', value: payload.alertId, short: true }] : []),
          ...(payload.escalationId ? [{ title: 'Escalation ID', value: payload.escalationId, short: true }] : []),
        ],
      }],
    }, { timeout: 8000 })

    this.logger.log(`[SLACK] ✓ ${payload.recipient} | ${payload.subject}`)
  }

  // ── MS Teams ──────────────────────────────────────────────────────────────

  private async sendTeams(payload: DispatchPayload, cfg: any): Promise<void> {
    const axios = (await import('axios')).default

    await axios.post(cfg.webhookUrl, {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: this.severityColor(payload.subject).replace('#', ''),
      summary: payload.subject,
      sections: [{
        activityTitle: `**${payload.subject}**`,
        activityText: payload.body ?? '',
        facts: [
          ...(payload.alertId ? [{ name: 'Alert ID', value: payload.alertId }] : []),
          ...(payload.escalationId ? [{ name: 'Escalation ID', value: payload.escalationId }] : []),
          { name: 'Recipient', value: payload.recipient },
        ],
      }],
    }, { timeout: 8000 })

    this.logger.log(`[TEAMS] ✓ ${payload.recipient} | ${payload.subject}`)
  }

  // ── Voice (Twilio) ────────────────────────────────────────────────────────

  private async sendVoice(payload: DispatchPayload, cfg: any): Promise<void> {
    const twilio = (await import('twilio')).default
    const client = twilio(cfg.accountSid, cfg.authToken)

    const twiml = `<Response>
      <Say voice="alice" loop="2">${this.sanitizeTwiml(payload.subject)}</Say>
      <Pause length="1"/>
      <Say voice="alice">To acknowledge, log into OpsAura. End of message.</Say>
    </Response>`

    await client.calls.create({
      to: payload.recipient,
      from: cfg.fromNumber,
      twiml,
    })

    this.logger.log(`[VOICE] ✓ ${payload.recipient} | ${payload.subject}`)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private buildEmailHtml(payload: DispatchPayload): string {
    const body = payload.body ?? ''
    const links = [
      payload.alertId ? `<a href="#">View Alert</a>` : '',
      payload.escalationId ? `<a href="#">View Escalation</a>` : '',
    ].filter(Boolean).join(' | ')

    return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:auto">
      <div style="background:#1a1a2e;padding:16px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0">OpsAura Alert</h2>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        <h3>${payload.subject}</h3>
        ${body ? `<p>${body}</p>` : ''}
        ${links ? `<p style="margin-top:24px">${links}</p>` : ''}
      </div>
      <p style="color:#999;font-size:12px;text-align:center;margin-top:16px">
        Sent by OpsAura Incident Response Platform
      </p>
    </body></html>`
  }

  private severityColor(subject: string): string {
    const s = subject.toUpperCase()
    if (s.includes('CRITICAL')) return '#dc2626'
    if (s.includes('HIGH'))     return '#ea580c'
    if (s.includes('MEDIUM'))   return '#d97706'
    if (s.includes('LOW'))      return '#2563eb'
    return '#64748b'
  }

  private sanitizeTwiml(text: string): string {
    return text.replace(/[<>&"']/g, (c) => (
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' } as any)[c] ?? c
    ))
  }

  private async recordDelivery(
    tenantSlug: string,
    payload: DispatchPayload,
    status: string,
    errorMessage?: string,
    channelId?: string,
  ): Promise<void> {
    try {
      const db = this.tenantFactory.getClient(tenantSlug)
      const resolvedChannelId = channelId ?? (
        await db.notificationChannel.findFirst({ where: { type: payload.channel.toUpperCase() as any } })
      )?.id

      if (!resolvedChannelId) return

      await db.notificationDelivery.create({
        data: {
          channelId: resolvedChannelId,
          recipient: payload.recipient,
          subject: payload.subject,
          status: status as any,
          alertId: payload.alertId ?? null,
          escalationId: payload.escalationId ?? null,
          errorMessage: errorMessage ?? null,
          sentAt: status === 'DELIVERED' ? new Date() : null,
        },
      })
    } catch (err) {
      this.logger.error('Failed to record delivery', err)
    }
  }
}

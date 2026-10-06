import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TenantContextService } from '../tenant/tenant-context.service'
import { encryptChannelConfig, decryptChannelConfig } from '../common/util/channel-config.util'
import type {
  CreateNotificationChannelDto,
  UpdateNotificationChannelDto,
} from './dto/notification-channel.dto'

const SAFE_SELECT = { id: true, name: true, type: true, connected: true, updatedAt: true }

@Injectable()
export class NotificationChannelsService {
  private readonly logger = new Logger(NotificationChannelsService.name)

  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly config: ConfigService,
  ) {}

  private get db() { return this.tenantContext.getDb() }
  private get encKey() { return this.config.getOrThrow<string>('CHANNEL_ENCRYPTION_KEY') }

  findAll() {
    return this.db.notificationChannel.findMany({
      select: SAFE_SELECT,
      orderBy: { type: 'asc' },
    })
  }

  async findOne(id: string) {
    const ch = await this.db.notificationChannel.findUnique({ where: { id }, select: SAFE_SELECT })
    if (!ch) throw new NotFoundException(`Notification channel ${id} not found`)
    return ch
  }

  async getDecryptedConfig<T = Record<string, any>>(id: string): Promise<T> {
    const ch = await this.db.notificationChannel.findUnique({
      where: { id },
      select: { configVaultKey: true },
    })
    if (!ch) throw new NotFoundException(`Channel ${id} not found`)
    return decryptChannelConfig<T>(ch.configVaultKey, this.encKey)
  }

  async create(dto: CreateNotificationChannelDto) {
    const encrypted = encryptChannelConfig(dto.config as object, this.encKey)
    return this.db.notificationChannel.create({
      data: { name: dto.name, type: dto.type as any, configVaultKey: encrypted, connected: false },
      select: SAFE_SELECT,
    })
  }

  async update(id: string, dto: UpdateNotificationChannelDto) {
    await this.findOne(id)
    const data: any = {}
    if (dto.name) data.name = dto.name
    if (dto.config) {
      data.configVaultKey = encryptChannelConfig(dto.config as object, this.encKey)
      data.connected = false
    }
    return this.db.notificationChannel.update({ where: { id }, data, select: SAFE_SELECT })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.db.notificationChannel.delete({ where: { id } })
  }

  async testConnection(id: string, recipient?: string): Promise<{ success: boolean; message: string }> {
    const channel = await this.db.notificationChannel.findUnique({ where: { id } })
    if (!channel) throw new NotFoundException(`Channel ${id} not found`)
    const cfg = decryptChannelConfig(channel.configVaultKey, this.encKey)

    try {
      await this.runTest(channel.type as string, cfg, recipient)
      await this.db.notificationChannel.update({ where: { id }, data: { connected: true } })
      return { success: true, message: `${channel.type} test sent successfully` }
    } catch (err) {
      await this.db.notificationChannel.update({ where: { id }, data: { connected: false } })
      return { success: false, message: (err as Error).message }
    }
  }

  private async runTest(type: string, cfg: any, recipient?: string): Promise<void> {
    // Imported lazily to avoid pulling heavy deps into all code paths
    switch (type) {
      case 'EMAIL': {
        const nodemailer = await import('nodemailer')
        const transport = nodemailer.createTransport({
          host: cfg.host, port: Number(cfg.port),
          secure: cfg.tls ?? false,
          auth: { user: cfg.user, pass: cfg.password },
        })
        await transport.verify()
        await transport.sendMail({
          from: cfg.from,
          to: recipient ?? cfg.user,
          subject: 'OpsAura — connection test',
          text: 'This is a test notification from OpsAura.',
        })
        break
      }
      case 'SLACK': {
        const axios = (await import('axios')).default
        await axios.post(cfg.webhookUrl, {
          text: ':white_check_mark: OpsAura Slack connection test successful.',
          ...(cfg.channel ? { channel: cfg.channel } : {}),
        })
        break
      }
      case 'TEAMS': {
        const axios = (await import('axios')).default
        await axios.post(cfg.webhookUrl, {
          '@type': 'MessageCard',
          '@context': 'http://schema.org/extensions',
          summary: 'OpsAura connection test',
          themeColor: '0078D4',
          title: 'OpsAura — Connection Test',
          text: 'Teams notification channel verified successfully.',
        })
        break
      }
      case 'VOICE': {
        const twilio = (await import('twilio')).default
        const client = twilio(cfg.accountSid, cfg.authToken)
        await client.calls.create({
          to: recipient ?? cfg.fromNumber,
          from: cfg.fromNumber,
          twiml: '<Response><Say>OpsAura connection test successful.</Say></Response>',
        })
        break
      }
      default:
        throw new Error(`Unknown channel type: ${type}`)
    }
  }

  async getDeliveryLog(channelId: string, limit = 50) {
    return this.db.notificationDelivery.findMany({
      where: { channelId },
      orderBy: { sentAt: 'desc' },
      take: limit,
      select: {
        id: true, recipient: true, subject: true, status: true,
        errorMessage: true, retryCount: true, sentAt: true,
        alert: { select: { id: true, title: true } },
      },
    })
  }
}

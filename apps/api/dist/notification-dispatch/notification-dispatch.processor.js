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
var NotificationDispatchProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDispatchProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const tenant_prisma_factory_1 = require("../database/tenant-prisma.factory");
const channel_config_util_1 = require("../common/util/channel-config.util");
let NotificationDispatchProcessor = NotificationDispatchProcessor_1 = class NotificationDispatchProcessor {
    constructor(config, tenantFactory) {
        this.config = config;
        this.tenantFactory = tenantFactory;
        this.logger = new common_1.Logger(NotificationDispatchProcessor_1.name);
    }
    get encKey() { return this.config.getOrThrow('CHANNEL_ENCRYPTION_KEY'); }
    async handleSend(job) {
        const { channel, tenantSlug } = job.data;
        try {
            const db = this.tenantFactory.getClient(tenantSlug);
            const channelRecord = await db.notificationChannel.findFirst({
                where: { type: channel.toUpperCase(), connected: true },
            });
            if (!channelRecord) {
                this.logger.warn(`No connected ${channel} channel for tenant ${tenantSlug} — skipping`);
                await this.recordDelivery(tenantSlug, job.data, 'FAILED', `No connected ${channel} channel configured`);
                return;
            }
            const cfg = (0, channel_config_util_1.decryptChannelConfig)(channelRecord.configVaultKey, this.encKey);
            switch (channel) {
                case 'email':
                    await this.sendEmail(job.data, cfg);
                    break;
                case 'slack':
                    await this.sendSlack(job.data, cfg);
                    break;
                case 'teams':
                    await this.sendTeams(job.data, cfg);
                    break;
                case 'voice':
                    await this.sendVoice(job.data, cfg);
                    break;
                default:
                    throw new Error(`Unknown channel: ${channel}`);
            }
            await this.recordDelivery(tenantSlug, job.data, 'DELIVERED', undefined, channelRecord.id);
        }
        catch (err) {
            this.logger.error(`[${channel}] Failed → ${job.data.recipient}: ${err.message}`);
            await this.recordDelivery(tenantSlug, job.data, 'FAILED', err.message);
            throw err;
        }
    }
    async sendEmail(payload, cfg) {
        const nodemailer = await Promise.resolve().then(() => require('nodemailer'));
        const transport = nodemailer.createTransport({
            host: cfg.host,
            port: Number(cfg.port),
            secure: cfg.tls ?? false,
            auth: { user: cfg.user, pass: cfg.password },
        });
        await transport.sendMail({
            from: cfg.from ?? `OpsAura <${cfg.user}>`,
            to: payload.recipient,
            subject: payload.subject,
            html: this.buildEmailHtml(payload),
            text: payload.body ?? payload.subject,
        });
        this.logger.log(`[EMAIL] ✓ ${payload.recipient} | ${payload.subject}`);
    }
    async sendSlack(payload, cfg) {
        const axios = (await Promise.resolve().then(() => require('axios'))).default;
        const color = this.severityColor(payload.subject);
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
        }, { timeout: 8000 });
        this.logger.log(`[SLACK] ✓ ${payload.recipient} | ${payload.subject}`);
    }
    async sendTeams(payload, cfg) {
        const axios = (await Promise.resolve().then(() => require('axios'))).default;
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
        }, { timeout: 8000 });
        this.logger.log(`[TEAMS] ✓ ${payload.recipient} | ${payload.subject}`);
    }
    async sendVoice(payload, cfg) {
        const twilio = (await Promise.resolve().then(() => require('twilio'))).default;
        const client = twilio(cfg.accountSid, cfg.authToken);
        const twiml = `<Response>
      <Say voice="alice" loop="2">${this.sanitizeTwiml(payload.subject)}</Say>
      <Pause length="1"/>
      <Say voice="alice">To acknowledge, log into OpsAura. End of message.</Say>
    </Response>`;
        await client.calls.create({
            to: payload.recipient,
            from: cfg.fromNumber,
            twiml,
        });
        this.logger.log(`[VOICE] ✓ ${payload.recipient} | ${payload.subject}`);
    }
    buildEmailHtml(payload) {
        const body = payload.body ?? '';
        const links = [
            payload.alertId ? `<a href="#">View Alert</a>` : '',
            payload.escalationId ? `<a href="#">View Escalation</a>` : '',
        ].filter(Boolean).join(' | ');
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
    </body></html>`;
    }
    severityColor(subject) {
        const s = subject.toUpperCase();
        if (s.includes('CRITICAL'))
            return '#dc2626';
        if (s.includes('HIGH'))
            return '#ea580c';
        if (s.includes('MEDIUM'))
            return '#d97706';
        if (s.includes('LOW'))
            return '#2563eb';
        return '#64748b';
    }
    sanitizeTwiml(text) {
        return text.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c] ?? c));
    }
    async recordDelivery(tenantSlug, payload, status, errorMessage, channelId) {
        try {
            const db = this.tenantFactory.getClient(tenantSlug);
            const resolvedChannelId = channelId ?? (await db.notificationChannel.findFirst({ where: { type: payload.channel.toUpperCase() } }))?.id;
            if (!resolvedChannelId)
                return;
            await db.notificationDelivery.create({
                data: {
                    channelId: resolvedChannelId,
                    recipient: payload.recipient,
                    subject: payload.subject,
                    status: status,
                    alertId: payload.alertId ?? null,
                    escalationId: payload.escalationId ?? null,
                    errorMessage: errorMessage ?? null,
                    sentAt: status === 'DELIVERED' ? new Date() : null,
                },
            });
        }
        catch (err) {
            this.logger.error('Failed to record delivery', err);
        }
    }
};
exports.NotificationDispatchProcessor = NotificationDispatchProcessor;
__decorate([
    (0, bull_1.Process)('send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationDispatchProcessor.prototype, "handleSend", null);
exports.NotificationDispatchProcessor = NotificationDispatchProcessor = NotificationDispatchProcessor_1 = __decorate([
    (0, bull_1.Processor)('notification-dispatch'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        tenant_prisma_factory_1.TenantPrismaFactory])
], NotificationDispatchProcessor);
//# sourceMappingURL=notification-dispatch.processor.js.map
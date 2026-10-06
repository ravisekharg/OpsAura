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
var NotificationChannelsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationChannelsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const channel_config_util_1 = require("../common/util/channel-config.util");
const SAFE_SELECT = { id: true, name: true, type: true, connected: true, updatedAt: true };
let NotificationChannelsService = NotificationChannelsService_1 = class NotificationChannelsService {
    constructor(tenantContext, config) {
        this.tenantContext = tenantContext;
        this.config = config;
        this.logger = new common_1.Logger(NotificationChannelsService_1.name);
    }
    get db() { return this.tenantContext.getDb(); }
    get encKey() { return this.config.getOrThrow('CHANNEL_ENCRYPTION_KEY'); }
    findAll() {
        return this.db.notificationChannel.findMany({
            select: SAFE_SELECT,
            orderBy: { type: 'asc' },
        });
    }
    async findOne(id) {
        const ch = await this.db.notificationChannel.findUnique({ where: { id }, select: SAFE_SELECT });
        if (!ch)
            throw new common_1.NotFoundException(`Notification channel ${id} not found`);
        return ch;
    }
    async getDecryptedConfig(id) {
        const ch = await this.db.notificationChannel.findUnique({
            where: { id },
            select: { configVaultKey: true },
        });
        if (!ch)
            throw new common_1.NotFoundException(`Channel ${id} not found`);
        return (0, channel_config_util_1.decryptChannelConfig)(ch.configVaultKey, this.encKey);
    }
    async create(dto) {
        const encrypted = (0, channel_config_util_1.encryptChannelConfig)(dto.config, this.encKey);
        return this.db.notificationChannel.create({
            data: { name: dto.name, type: dto.type, configVaultKey: encrypted, connected: false },
            select: SAFE_SELECT,
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = {};
        if (dto.name)
            data.name = dto.name;
        if (dto.config) {
            data.configVaultKey = (0, channel_config_util_1.encryptChannelConfig)(dto.config, this.encKey);
            data.connected = false;
        }
        return this.db.notificationChannel.update({ where: { id }, data, select: SAFE_SELECT });
    }
    async remove(id) {
        await this.findOne(id);
        return this.db.notificationChannel.delete({ where: { id } });
    }
    async testConnection(id, recipient) {
        const channel = await this.db.notificationChannel.findUnique({ where: { id } });
        if (!channel)
            throw new common_1.NotFoundException(`Channel ${id} not found`);
        const cfg = (0, channel_config_util_1.decryptChannelConfig)(channel.configVaultKey, this.encKey);
        try {
            await this.runTest(channel.type, cfg, recipient);
            await this.db.notificationChannel.update({ where: { id }, data: { connected: true } });
            return { success: true, message: `${channel.type} test sent successfully` };
        }
        catch (err) {
            await this.db.notificationChannel.update({ where: { id }, data: { connected: false } });
            return { success: false, message: err.message };
        }
    }
    async runTest(type, cfg, recipient) {
        switch (type) {
            case 'EMAIL': {
                const nodemailer = await Promise.resolve().then(() => require('nodemailer'));
                const transport = nodemailer.createTransport({
                    host: cfg.host, port: Number(cfg.port),
                    secure: cfg.tls ?? false,
                    auth: { user: cfg.user, pass: cfg.password },
                });
                await transport.verify();
                await transport.sendMail({
                    from: cfg.from,
                    to: recipient ?? cfg.user,
                    subject: 'OpsAura — connection test',
                    text: 'This is a test notification from OpsAura.',
                });
                break;
            }
            case 'SLACK': {
                const axios = (await Promise.resolve().then(() => require('axios'))).default;
                await axios.post(cfg.webhookUrl, {
                    text: ':white_check_mark: OpsAura Slack connection test successful.',
                    ...(cfg.channel ? { channel: cfg.channel } : {}),
                });
                break;
            }
            case 'TEAMS': {
                const axios = (await Promise.resolve().then(() => require('axios'))).default;
                await axios.post(cfg.webhookUrl, {
                    '@type': 'MessageCard',
                    '@context': 'http://schema.org/extensions',
                    summary: 'OpsAura connection test',
                    themeColor: '0078D4',
                    title: 'OpsAura — Connection Test',
                    text: 'Teams notification channel verified successfully.',
                });
                break;
            }
            case 'VOICE': {
                const twilio = (await Promise.resolve().then(() => require('twilio'))).default;
                const client = twilio(cfg.accountSid, cfg.authToken);
                await client.calls.create({
                    to: recipient ?? cfg.fromNumber,
                    from: cfg.fromNumber,
                    twiml: '<Response><Say>OpsAura connection test successful.</Say></Response>',
                });
                break;
            }
            default:
                throw new Error(`Unknown channel type: ${type}`);
        }
    }
    async getDeliveryLog(channelId, limit = 50) {
        return this.db.notificationDelivery.findMany({
            where: { channelId },
            orderBy: { sentAt: 'desc' },
            take: limit,
            select: {
                id: true, recipient: true, subject: true, status: true,
                errorMessage: true, retryCount: true, sentAt: true,
                alert: { select: { id: true, title: true } },
            },
        });
    }
};
exports.NotificationChannelsService = NotificationChannelsService;
exports.NotificationChannelsService = NotificationChannelsService = NotificationChannelsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService,
        config_1.ConfigService])
], NotificationChannelsService);
//# sourceMappingURL=notification-channels.service.js.map
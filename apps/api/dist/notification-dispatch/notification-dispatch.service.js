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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationDispatchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDispatchService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
let NotificationDispatchService = NotificationDispatchService_1 = class NotificationDispatchService {
    constructor(queue) {
        this.queue = queue;
        this.logger = new common_1.Logger(NotificationDispatchService_1.name);
    }
    async dispatch(payload) {
        await this.queue.add('send', payload, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
        });
        this.logger.debug(`Queued ${payload.channel} → ${payload.recipient}: ${payload.subject}`);
    }
    async dispatchAlertNotification(tenantSlug, alertTitle, severity, channels, recipients, alertId) {
        const subject = `[${severity}] Alert: ${alertTitle}`;
        for (const channel of channels) {
            for (const recipient of recipients) {
                await this.dispatch({ tenantSlug, channel, recipient, subject, alertId });
            }
        }
    }
    async dispatchEscalationNotification(tenantSlug, escalationTitle, stepOrder, channels, recipients, escalationId) {
        const subject = `[Escalation Step ${stepOrder}] ${escalationTitle}`;
        for (const channel of channels) {
            for (const recipient of recipients) {
                await this.dispatch({ tenantSlug, channel, recipient, subject, escalationId });
            }
        }
    }
};
exports.NotificationDispatchService = NotificationDispatchService;
exports.NotificationDispatchService = NotificationDispatchService = NotificationDispatchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('notification-dispatch')),
    __metadata("design:paramtypes", [Object])
], NotificationDispatchService);
//# sourceMappingURL=notification-dispatch.service.js.map
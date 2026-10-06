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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
let AuditService = AuditService_1 = class AuditService {
    constructor(auditQueue, config) {
        this.auditQueue = auditQueue;
        this.config = config;
        this.logger = new common_1.Logger(AuditService_1.name);
        this.queueName = config.get('AUDIT_QUEUE_NAME', 'audit-events');
    }
    async emit(event) {
        try {
            await this.auditQueue.add('persist', event, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true,
                removeOnFail: false,
            });
        }
        catch (err) {
            this.logger.error('Failed to enqueue audit event', err);
        }
    }
    async emitSync(event, db) {
        try {
            const prisma = db;
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
            });
        }
        catch (err) {
            this.logger.error('Failed to write sync audit event', err);
        }
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('audit-events')),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], AuditService);
//# sourceMappingURL=audit.service.js.map
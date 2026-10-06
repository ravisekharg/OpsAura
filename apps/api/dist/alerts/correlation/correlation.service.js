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
var CorrelationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const alerts_repository_1 = require("../alerts.repository");
let CorrelationService = CorrelationService_1 = class CorrelationService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(CorrelationService_1.name);
    }
    async resolveCorrelationGroup(alert) {
        const rules = await this.repo.findActiveCorrelationRules();
        for (const rule of rules) {
            if (this.matchesRule(alert, rule)) {
                const groupKey = this.buildGroupKey(alert, rule);
                this.logger.debug(`Alert correlated by rule "${rule.id}" → group=${groupKey}`);
                return groupKey;
            }
        }
        return undefined;
    }
    matchesRule(alert, rule) {
        const field = rule.matchField.toLowerCase();
        const value = rule.matchValue.toLowerCase();
        switch (field) {
            case 'service': return alert.serviceName?.toLowerCase() === value;
            case 'severity': return alert.severity.toLowerCase() === value;
            case 'source': return alert.source.toLowerCase() === value;
            case 'tag': return alert.tags.some((t) => t.toLowerCase() === value);
            default: return false;
        }
    }
    buildGroupKey(alert, rule) {
        const windowMs = rule.windowMinutes * 60 * 1000;
        const windowBucket = Math.floor(Date.now() / windowMs);
        const groupField = rule.groupBy.toLowerCase();
        let groupValue;
        switch (groupField) {
            case 'service':
                groupValue = alert.serviceName ?? 'unknown';
                break;
            case 'severity':
                groupValue = alert.severity;
                break;
            case 'source':
                groupValue = alert.source;
                break;
            case 'tag':
                groupValue = alert.tags[0] ?? 'unknown';
                break;
            default:
                groupValue = alert.title;
        }
        const raw = `${rule.id}:${groupField}:${groupValue}:${windowBucket}`;
        return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
    }
};
exports.CorrelationService = CorrelationService;
exports.CorrelationService = CorrelationService = CorrelationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [alerts_repository_1.AlertsRepository])
], CorrelationService);
//# sourceMappingURL=correlation.service.js.map
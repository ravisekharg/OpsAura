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
var SuppressionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppressionService = void 0;
const common_1 = require("@nestjs/common");
const alerts_repository_1 = require("../alerts.repository");
let SuppressionService = SuppressionService_1 = class SuppressionService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(SuppressionService_1.name);
    }
    async isSuppressed(alert) {
        const rules = await this.repo.findActiveSuppressionRules();
        for (const rule of rules) {
            if (this.matches(alert, rule)) {
                this.logger.debug(`Alert suppressed by rule "${rule.id}": ${rule.matchField}=${rule.matchValue}`);
                return { suppressed: true, reason: rule.reason };
            }
        }
        return { suppressed: false };
    }
    matches(alert, rule) {
        const field = rule.matchField.toLowerCase();
        const value = rule.matchValue.toLowerCase();
        switch (field) {
            case 'service':
                return alert.serviceName?.toLowerCase() === value;
            case 'severity':
                return alert.severity.toLowerCase() === value;
            case 'source':
                return alert.source.toLowerCase() === value;
            case 'tag':
                return alert.tags.some((t) => t.toLowerCase() === value);
            case 'title':
                return alert.title.toLowerCase().includes(value);
            default:
                return false;
        }
    }
};
exports.SuppressionService = SuppressionService;
exports.SuppressionService = SuppressionService = SuppressionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [alerts_repository_1.AlertsRepository])
], SuppressionService);
//# sourceMappingURL=suppression.service.js.map
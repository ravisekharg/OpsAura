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
var DedupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DedupService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const alerts_repository_1 = require("../alerts.repository");
const DEFAULT_DEDUP_WINDOW_MINUTES = 5;
let DedupService = DedupService_1 = class DedupService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(DedupService_1.name);
    }
    generateFingerprint(title, source, serviceName) {
        const raw = [title, source ?? '', serviceName ?? '']
            .map((s) => s.toLowerCase().trim())
            .join('|');
        return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
    }
    async checkDuplicate(fingerprint, windowMinutes = DEFAULT_DEDUP_WINDOW_MINUTES) {
        const existing = await this.repo.findByFingerprint(fingerprint, windowMinutes);
        if (existing) {
            this.logger.debug(`Duplicate detected: fingerprint=${fingerprint} existing=${existing.id} count=${existing.dedupCount + 1}`);
            const updated = await this.repo.incrementDedupCount(existing.id);
            return { isDuplicate: true, alert: updated };
        }
        return { isDuplicate: false, alert: null };
    }
};
exports.DedupService = DedupService;
exports.DedupService = DedupService = DedupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [alerts_repository_1.AlertsRepository])
], DedupService);
//# sourceMappingURL=dedup.service.js.map
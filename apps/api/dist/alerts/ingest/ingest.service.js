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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestService = void 0;
const common_1 = require("@nestjs/common");
const dedup_service_1 = require("../dedup/dedup.service");
const SEVERITY_MAP = {
    critical: 'CRITICAL',
    high: 'HIGH',
    warning: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
    info: 'INFO',
    none: 'INFO',
};
let IngestService = class IngestService {
    constructor(dedup) {
        this.dedup = dedup;
    }
    normalizeGeneric(dto) {
        const severity = SEVERITY_MAP[dto.severity ?? 'medium'] ?? 'MEDIUM';
        const source = dto.source ?? 'generic';
        const fingerprint = dto.fingerprint ?? this.dedup.generateFingerprint(dto.title, source, dto.service);
        return {
            title: dto.title,
            description: dto.description,
            severity,
            source,
            serviceName: dto.service,
            tags: dto.tags ?? [],
            fingerprint,
            rawPayload: dto.payload ?? {},
        };
    }
    normalizePrometheus(dto) {
        return dto.alerts
            .filter((a) => a.status === 'firing')
            .map((a) => {
            const labels = a.labels ?? {};
            const annotations = a.annotations ?? {};
            const title = annotations.summary ?? labels.alertname ?? 'Prometheus Alert';
            const description = annotations.description;
            const severity = SEVERITY_MAP[labels.severity?.toLowerCase() ?? 'medium'] ?? 'MEDIUM';
            const service = labels.service ?? labels.namespace;
            const tags = Object.entries(labels)
                .filter(([k]) => !['alertname', 'severity', 'service', 'namespace'].includes(k))
                .map(([k, v]) => `${k}:${v}`);
            const fingerprint = a.fingerprint ?? this.dedup.generateFingerprint(title, 'prometheus', service);
            return {
                title,
                description,
                severity,
                source: 'prometheus',
                serviceName: service,
                tags,
                fingerprint,
                rawPayload: { labels, annotations, groupKey: dto.groupKey },
            };
        });
    }
};
exports.IngestService = IngestService;
exports.IngestService = IngestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dedup_service_1.DedupService])
], IngestService);
//# sourceMappingURL=ingest.service.js.map
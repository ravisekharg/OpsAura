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
exports.PrometheusWebhookDto = exports.PrometheusAlertDto = exports.PrometheusLabelsDto = exports.PrometheusAnnotationsDto = exports.GenericIngestDto = exports.IngestSeverity = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var IngestSeverity;
(function (IngestSeverity) {
    IngestSeverity["CRITICAL"] = "critical";
    IngestSeverity["HIGH"] = "high";
    IngestSeverity["MEDIUM"] = "medium";
    IngestSeverity["LOW"] = "low";
    IngestSeverity["INFO"] = "info";
})(IngestSeverity || (exports.IngestSeverity = IngestSeverity = {}));
class GenericIngestDto {
}
exports.GenericIngestDto = GenericIngestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DB connection pool exhausted' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenericIngestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenericIngestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: IngestSeverity, default: IngestSeverity.MEDIUM }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(IngestSeverity),
    __metadata("design:type", String)
], GenericIngestDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Prometheus' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenericIngestDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Auth Service', description: 'Service name to match against services table' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenericIngestDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['db', 'postgres', 'prod'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GenericIngestDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Stable string used for deduplication. Auto-generated if omitted.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenericIngestDto.prototype, "fingerprint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Any additional payload stored as raw JSON' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], GenericIngestDto.prototype, "payload", void 0);
class PrometheusAnnotationsDto {
}
exports.PrometheusAnnotationsDto = PrometheusAnnotationsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusAnnotationsDto.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusAnnotationsDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusAnnotationsDto.prototype, "runbook_url", void 0);
class PrometheusLabelsDto {
}
exports.PrometheusLabelsDto = PrometheusLabelsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusLabelsDto.prototype, "alertname", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusLabelsDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusLabelsDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusLabelsDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusLabelsDto.prototype, "pod", void 0);
class PrometheusAlertDto {
}
exports.PrometheusAlertDto = PrometheusAlertDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusAlertDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PrometheusLabelsDto),
    __metadata("design:type", PrometheusLabelsDto)
], PrometheusAlertDto.prototype, "labels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PrometheusAnnotationsDto),
    __metadata("design:type", PrometheusAnnotationsDto)
], PrometheusAlertDto.prototype, "annotations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusAlertDto.prototype, "startsAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusAlertDto.prototype, "endsAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusAlertDto.prototype, "fingerprint", void 0);
class PrometheusWebhookDto {
}
exports.PrometheusWebhookDto = PrometheusWebhookDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusWebhookDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusWebhookDto.prototype, "groupKey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrometheusWebhookDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PrometheusWebhookDto.prototype, "truncatedAlerts", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PrometheusAlertDto),
    __metadata("design:type", Array)
], PrometheusWebhookDto.prototype, "alerts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PrometheusWebhookDto.prototype, "groupLabels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PrometheusWebhookDto.prototype, "commonLabels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PrometheusWebhookDto.prototype, "commonAnnotations", void 0);
//# sourceMappingURL=ingest.dto.js.map
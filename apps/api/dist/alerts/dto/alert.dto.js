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
exports.AlertQueryDto = exports.AlertStatusFilter = exports.AlertSeverityFilter = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AlertSeverityFilter;
(function (AlertSeverityFilter) {
    AlertSeverityFilter["CRITICAL"] = "CRITICAL";
    AlertSeverityFilter["HIGH"] = "HIGH";
    AlertSeverityFilter["MEDIUM"] = "MEDIUM";
    AlertSeverityFilter["LOW"] = "LOW";
    AlertSeverityFilter["INFO"] = "INFO";
})(AlertSeverityFilter || (exports.AlertSeverityFilter = AlertSeverityFilter = {}));
var AlertStatusFilter;
(function (AlertStatusFilter) {
    AlertStatusFilter["FIRING"] = "FIRING";
    AlertStatusFilter["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    AlertStatusFilter["RESOLVED"] = "RESOLVED";
    AlertStatusFilter["SUPPRESSED"] = "SUPPRESSED";
})(AlertStatusFilter || (exports.AlertStatusFilter = AlertStatusFilter = {}));
class AlertQueryDto {
}
exports.AlertQueryDto = AlertQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AlertStatusFilter }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AlertStatusFilter),
    __metadata("design:type", String)
], AlertQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AlertSeverityFilter }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AlertSeverityFilter),
    __metadata("design:type", String)
], AlertQueryDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AlertQueryDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AlertQueryDto.prototype, "assignmentGroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlertQueryDto.prototype, "search", void 0);
//# sourceMappingURL=alert.dto.js.map
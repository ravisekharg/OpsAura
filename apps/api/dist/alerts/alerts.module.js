"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsModule = void 0;
const common_1 = require("@nestjs/common");
const alerts_controller_1 = require("./alerts.controller");
const alerts_service_1 = require("./alerts.service");
const alerts_repository_1 = require("./alerts.repository");
const ingest_controller_1 = require("./ingest/ingest.controller");
const ingest_service_1 = require("./ingest/ingest.service");
const dedup_service_1 = require("./dedup/dedup.service");
const suppression_service_1 = require("./suppression/suppression.service");
const correlation_service_1 = require("./correlation/correlation.service");
const routing_engine_service_1 = require("./routing/routing-engine.service");
const oncall_resolver_service_1 = require("./routing/oncall-resolver.service");
let AlertsModule = class AlertsModule {
};
exports.AlertsModule = AlertsModule;
exports.AlertsModule = AlertsModule = __decorate([
    (0, common_1.Module)({
        controllers: [alerts_controller_1.AlertsController, ingest_controller_1.IngestController],
        providers: [
            alerts_service_1.AlertsService,
            alerts_repository_1.AlertsRepository,
            ingest_service_1.IngestService,
            dedup_service_1.DedupService,
            suppression_service_1.SuppressionService,
            correlation_service_1.CorrelationService,
            routing_engine_service_1.RoutingEngineService,
            oncall_resolver_service_1.OnCallResolverService,
        ],
        exports: [alerts_service_1.AlertsService, oncall_resolver_service_1.OnCallResolverService],
    })
], AlertsModule);
//# sourceMappingURL=alerts.module.js.map
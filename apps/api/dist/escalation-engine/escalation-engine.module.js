"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscalationEngineModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const escalation_engine_service_1 = require("./escalation-engine.service");
const escalation_engine_processor_1 = require("./escalation-engine.processor");
let EscalationEngineModule = class EscalationEngineModule {
};
exports.EscalationEngineModule = EscalationEngineModule;
exports.EscalationEngineModule = EscalationEngineModule = __decorate([
    (0, common_1.Module)({
        imports: [bull_1.BullModule.registerQueue({ name: 'escalation-steps' })],
        providers: [escalation_engine_service_1.EscalationEngineService, escalation_engine_processor_1.EscalationEngineProcessor],
        exports: [escalation_engine_service_1.EscalationEngineService],
    })
], EscalationEngineModule);
//# sourceMappingURL=escalation-engine.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionEnforcementModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const bull_1 = require("@nestjs/bull");
const subscription_guard_1 = require("./subscription.guard");
const plan_limits_service_1 = require("./plan-limits.service");
const trial_expiry_processor_1 = require("./trial-expiry.processor");
const trial_expiry_scheduler_1 = require("./trial-expiry.scheduler");
const audit_module_1 = require("../audit/audit.module");
let SubscriptionEnforcementModule = class SubscriptionEnforcementModule {
};
exports.SubscriptionEnforcementModule = SubscriptionEnforcementModule;
exports.SubscriptionEnforcementModule = SubscriptionEnforcementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({ name: 'trial-expiry' }),
            audit_module_1.AuditModule,
        ],
        providers: [
            plan_limits_service_1.PlanLimitsService,
            trial_expiry_processor_1.TrialExpiryProcessor,
            trial_expiry_scheduler_1.TrialExpiryScheduler,
            subscription_guard_1.SubscriptionGuard,
            {
                provide: core_1.APP_GUARD,
                useClass: subscription_guard_1.SubscriptionGuard,
            },
        ],
        exports: [plan_limits_service_1.PlanLimitsService],
    })
], SubscriptionEnforcementModule);
//# sourceMappingURL=subscription-enforcement.module.js.map
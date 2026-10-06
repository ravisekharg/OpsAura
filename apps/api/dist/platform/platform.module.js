"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const audit_module_1 = require("../audit/audit.module");
const platform_auth_controller_1 = require("./auth/platform-auth.controller");
const platform_auth_service_1 = require("./auth/platform-auth.service");
const tenants_controller_1 = require("./tenants/tenants.controller");
const tenants_service_1 = require("./tenants/tenants.service");
const tenants_repository_1 = require("./tenants/tenants.repository");
const tenant_provisioner_service_1 = require("./provisioning/tenant-provisioner.service");
const plans_controller_1 = require("./plans/plans.controller");
const plans_service_1 = require("./plans/plans.service");
const plans_repository_1 = require("./plans/plans.repository");
const subscriptions_controller_1 = require("./subscriptions/subscriptions.controller");
const subscriptions_service_1 = require("./subscriptions/subscriptions.service");
const subscriptions_repository_1 = require("./subscriptions/subscriptions.repository");
const feature_flags_controller_1 = require("./feature-flags/feature-flags.controller");
const feature_flags_service_1 = require("./feature-flags/feature-flags.service");
const feature_flags_repository_1 = require("./feature-flags/feature-flags.repository");
const domains_controller_1 = require("./domains/domains.controller");
const domains_service_1 = require("./domains/domains.service");
const domains_repository_1 = require("./domains/domains.repository");
const billing_controller_1 = require("./billing/billing.controller");
const platform_audit_controller_1 = require("./audit/platform-audit.controller");
const platform_guard_1 = require("./guards/platform.guard");
let PlatformModule = class PlatformModule {
};
exports.PlatformModule = PlatformModule;
exports.PlatformModule = PlatformModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule, audit_module_1.AuditModule],
        controllers: [
            platform_auth_controller_1.PlatformAuthController,
            tenants_controller_1.TenantsController,
            plans_controller_1.PlansController,
            subscriptions_controller_1.SubscriptionsController,
            feature_flags_controller_1.FeatureFlagsController,
            domains_controller_1.DomainsController,
            billing_controller_1.BillingController,
            platform_audit_controller_1.PlatformAuditController,
        ],
        providers: [
            platform_auth_service_1.PlatformAuthService,
            tenants_service_1.TenantsService,
            tenants_repository_1.TenantsRepository,
            tenant_provisioner_service_1.TenantProvisionerService,
            plans_service_1.PlansService,
            plans_repository_1.PlansRepository,
            subscriptions_service_1.SubscriptionsService,
            subscriptions_repository_1.SubscriptionsRepository,
            feature_flags_service_1.FeatureFlagsService,
            feature_flags_repository_1.FeatureFlagsRepository,
            domains_service_1.DomainsService,
            domains_repository_1.DomainsRepository,
            platform_guard_1.PlatformGuard,
        ],
        exports: [feature_flags_service_1.FeatureFlagsService, tenants_service_1.TenantsService],
    })
], PlatformModule);
//# sourceMappingURL=platform.module.js.map
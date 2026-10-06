import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuditModule } from '../audit/audit.module'

// Auth
import { PlatformAuthController } from './auth/platform-auth.controller'
import { PlatformAuthService } from './auth/platform-auth.service'

// Tenants
import { TenantsController } from './tenants/tenants.controller'
import { TenantsService } from './tenants/tenants.service'
import { TenantsRepository } from './tenants/tenants.repository'
import { TenantProvisionerService } from './provisioning/tenant-provisioner.service'

// Plans
import { PlansController } from './plans/plans.controller'
import { PlansService } from './plans/plans.service'
import { PlansRepository } from './plans/plans.repository'

// Subscriptions
import { SubscriptionsController } from './subscriptions/subscriptions.controller'
import { SubscriptionsService } from './subscriptions/subscriptions.service'
import { SubscriptionsRepository } from './subscriptions/subscriptions.repository'

// Feature Flags
import { FeatureFlagsController } from './feature-flags/feature-flags.controller'
import { FeatureFlagsService } from './feature-flags/feature-flags.service'
import { FeatureFlagsRepository } from './feature-flags/feature-flags.repository'

// Domains
import { DomainsController } from './domains/domains.controller'
import { DomainsService } from './domains/domains.service'
import { DomainsRepository } from './domains/domains.repository'

// Billing & Audit
import { BillingController } from './billing/billing.controller'
import { PlatformAuditController } from './audit/platform-audit.controller'

// Guards
import { PlatformGuard } from './guards/platform.guard'

@Module({
  imports: [JwtModule, AuditModule],
  controllers: [
    PlatformAuthController,
    TenantsController,
    PlansController,
    SubscriptionsController,
    FeatureFlagsController,
    DomainsController,
    BillingController,
    PlatformAuditController,
  ],
  providers: [
    PlatformAuthService,
    TenantsService,
    TenantsRepository,
    TenantProvisionerService,
    PlansService,
    PlansRepository,
    SubscriptionsService,
    SubscriptionsRepository,
    FeatureFlagsService,
    FeatureFlagsRepository,
    DomainsService,
    DomainsRepository,
    PlatformGuard,
  ],
  exports: [FeatureFlagsService, TenantsService],
})
export class PlatformModule {}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const bull_1 = require("@nestjs/bull");
const database_module_1 = require("./database/database.module");
const tenant_module_1 = require("./tenant/tenant.module");
const auth_module_1 = require("./auth/auth.module");
const rbac_module_1 = require("./rbac/rbac.module");
const audit_module_1 = require("./audit/audit.module");
const users_module_1 = require("./users/users.module");
const teams_module_1 = require("./teams/teams.module");
const services_module_1 = require("./services/services.module");
const assignment_groups_module_1 = require("./assignment-groups/assignment-groups.module");
const alerts_module_1 = require("./alerts/alerts.module");
const platform_module_1 = require("./platform/platform.module");
const oncall_module_1 = require("./oncall/oncall.module");
const escalation_engine_module_1 = require("./escalation-engine/escalation-engine.module");
const notification_dispatch_module_1 = require("./notification-dispatch/notification-dispatch.module");
const subscription_enforcement_module_1 = require("./subscription-enforcement/subscription-enforcement.module");
const war_rooms_module_1 = require("./war-rooms/war-rooms.module");
const routing_rules_module_1 = require("./routing-rules/routing-rules.module");
const notification_channels_module_1 = require("./notification-channels/notification-channels.module");
const servicenow_module_1 = require("./servicenow/servicenow.module");
const api_keys_module_1 = require("./api-keys/api-keys.module");
const health_module_1 = require("./health/health.module");
const tenant_middleware_1 = require("./tenant/tenant.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(tenant_middleware_1.TenantMiddleware)
            .exclude({ path: 'v1/auth/login', method: common_1.RequestMethod.POST }, { path: 'v1/auth/refresh', method: common_1.RequestMethod.POST }, { path: 'v1/auth/reset-password', method: common_1.RequestMethod.POST }, { path: 'v1/auth/reset-password/confirm', method: common_1.RequestMethod.POST }, { path: 'v1/health', method: common_1.RequestMethod.GET }, { path: 'v1/platform/auth/login', method: common_1.RequestMethod.POST })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('THROTTLE_TTL', 60) * 1000,
                        limit: config.get('THROTTLE_LIMIT', 100),
                    },
                ],
            }),
            bull_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    redis: {
                        host: config.get('REDIS_HOST', 'localhost'),
                        port: config.get('REDIS_PORT', 6379),
                        password: config.get('REDIS_PASSWORD') || undefined,
                    },
                }),
            }),
            database_module_1.DatabaseModule,
            tenant_module_1.TenantModule,
            auth_module_1.AuthModule,
            rbac_module_1.RbacModule,
            audit_module_1.AuditModule,
            users_module_1.UsersModule,
            teams_module_1.TeamsModule,
            services_module_1.ServicesModule,
            assignment_groups_module_1.AssignmentGroupsModule,
            alerts_module_1.AlertsModule,
            platform_module_1.PlatformModule,
            oncall_module_1.OnCallModule,
            escalation_engine_module_1.EscalationEngineModule,
            notification_dispatch_module_1.NotificationDispatchModule,
            subscription_enforcement_module_1.SubscriptionEnforcementModule,
            war_rooms_module_1.WarRoomsModule,
            routing_rules_module_1.RoutingRulesModule,
            notification_channels_module_1.NotificationChannelsModule,
            servicenow_module_1.ServiceNowModule,
            api_keys_module_1.ApiKeysModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
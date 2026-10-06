import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { BullModule } from '@nestjs/bull'
import { DatabaseModule } from './database/database.module'
import { TenantModule } from './tenant/tenant.module'
import { AuthModule } from './auth/auth.module'
import { RbacModule } from './rbac/rbac.module'
import { AuditModule } from './audit/audit.module'
import { UsersModule } from './users/users.module'
import { TeamsModule } from './teams/teams.module'
import { ServicesModule } from './services/services.module'
import { AssignmentGroupsModule } from './assignment-groups/assignment-groups.module'
import { AlertsModule } from './alerts/alerts.module'
import { PlatformModule } from './platform/platform.module'
import { OnCallModule } from './oncall/oncall.module'
import { EscalationEngineModule } from './escalation-engine/escalation-engine.module'
import { NotificationDispatchModule } from './notification-dispatch/notification-dispatch.module'
import { SubscriptionEnforcementModule } from './subscription-enforcement/subscription-enforcement.module'
import { WarRoomsModule } from './war-rooms/war-rooms.module'
import { RoutingRulesModule } from './routing-rules/routing-rules.module'
import { NotificationChannelsModule } from './notification-channels/notification-channels.module'
import { ServiceNowModule } from './servicenow/servicenow.module'
import { ApiKeysModule } from './api-keys/api-keys.module'
import { HealthModule } from './health/health.module'
import { TenantMiddleware } from './tenant/tenant.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
    }),

    DatabaseModule,
    TenantModule,
    AuthModule,
    RbacModule,
    AuditModule,
    UsersModule,
    TeamsModule,
    ServicesModule,
    AssignmentGroupsModule,
    AlertsModule,
    PlatformModule,
    OnCallModule,
    EscalationEngineModule,
    NotificationDispatchModule,
    SubscriptionEnforcementModule,
    WarRoomsModule,
    RoutingRulesModule,
    NotificationChannelsModule,
    ServiceNowModule,
    ApiKeysModule,
    HealthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'v1/auth/login', method: RequestMethod.POST },
        { path: 'v1/auth/refresh', method: RequestMethod.POST },
        { path: 'v1/auth/reset-password', method: RequestMethod.POST },
        { path: 'v1/auth/reset-password/confirm', method: RequestMethod.POST },
        { path: 'v1/health', method: RequestMethod.GET },
        { path: 'v1/platform/auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*')
  }
}

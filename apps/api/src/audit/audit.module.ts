import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { BullModule } from '@nestjs/bull'
import { AuditService } from './audit.service'
import { AuditInterceptor } from './audit.interceptor'
import { AuditProcessor } from './audit.processor'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'audit-events' }),
  ],
  providers: [
    AuditService,
    AuditProcessor,
    {
      // Apply AuditInterceptor globally — fires post-response on every route
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}

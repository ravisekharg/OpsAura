import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { RbacGuard } from './rbac.guard'
import { RbacService } from './rbac.service'

@Module({
  providers: [
    RbacService,
    {
      // Apply RbacGuard globally after JwtAuthGuard
      provide: APP_GUARD,
      useClass: RbacGuard,
    },
  ],
  exports: [RbacService],
})
export class RbacModule {}

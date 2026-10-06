import { Module } from '@nestjs/common'
import { AlertsController } from './alerts.controller'
import { AlertsService } from './alerts.service'
import { AlertsRepository } from './alerts.repository'
import { IngestController } from './ingest/ingest.controller'
import { IngestService } from './ingest/ingest.service'
import { DedupService } from './dedup/dedup.service'
import { SuppressionService } from './suppression/suppression.service'
import { CorrelationService } from './correlation/correlation.service'
import { RoutingEngineService } from './routing/routing-engine.service'
import { OnCallResolverService } from './routing/oncall-resolver.service'

@Module({
  controllers: [AlertsController, IngestController],
  providers: [
    AlertsService,
    AlertsRepository,
    IngestService,
    DedupService,
    SuppressionService,
    CorrelationService,
    RoutingEngineService,
    OnCallResolverService,
  ],
  exports: [AlertsService, OnCallResolverService],
})
export class AlertsModule {}

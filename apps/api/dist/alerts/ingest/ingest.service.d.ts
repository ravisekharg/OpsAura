import type { GenericIngestDto, PrometheusWebhookDto, NormalizedAlert } from '../dto/ingest.dto';
import { DedupService } from '../dedup/dedup.service';
export declare class IngestService {
    private readonly dedup;
    constructor(dedup: DedupService);
    normalizeGeneric(dto: GenericIngestDto): NormalizedAlert;
    normalizePrometheus(dto: PrometheusWebhookDto): NormalizedAlert[];
}

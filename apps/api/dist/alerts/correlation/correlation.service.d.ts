import { AlertsRepository } from '../alerts.repository';
import type { NormalizedAlert } from '../dto/ingest.dto';
export declare class CorrelationService {
    private readonly repo;
    private readonly logger;
    constructor(repo: AlertsRepository);
    resolveCorrelationGroup(alert: NormalizedAlert): Promise<string | undefined>;
    private matchesRule;
    private buildGroupKey;
}

import { AlertsRepository } from '../alerts.repository';
import type { NormalizedAlert } from '../dto/ingest.dto';
export declare class SuppressionService {
    private readonly repo;
    private readonly logger;
    constructor(repo: AlertsRepository);
    isSuppressed(alert: NormalizedAlert): Promise<{
        suppressed: boolean;
        reason?: string;
    }>;
    private matches;
}

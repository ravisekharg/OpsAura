export declare enum IngestSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFO = "info"
}
export declare class GenericIngestDto {
    title: string;
    description?: string;
    severity?: IngestSeverity;
    source?: string;
    service?: string;
    tags?: string[];
    fingerprint?: string;
    payload?: Record<string, unknown>;
}
export declare class PrometheusAnnotationsDto {
    summary?: string;
    description?: string;
    runbook_url?: string;
}
export declare class PrometheusLabelsDto {
    alertname?: string;
    severity?: string;
    service?: string;
    namespace?: string;
    pod?: string;
    [key: string]: string | undefined;
}
export declare class PrometheusAlertDto {
    status: string;
    labels?: PrometheusLabelsDto;
    annotations?: PrometheusAnnotationsDto;
    startsAt?: string;
    endsAt?: string;
    fingerprint?: string;
}
export declare class PrometheusWebhookDto {
    version: string;
    groupKey: string;
    status: string;
    truncatedAlerts?: number;
    alerts: PrometheusAlertDto[];
    groupLabels?: Record<string, string>;
    commonLabels?: Record<string, string>;
    commonAnnotations?: Record<string, string>;
}
export interface NormalizedAlert {
    title: string;
    description?: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    source: string;
    serviceName?: string;
    tags: string[];
    fingerprint: string;
    rawPayload: Record<string, unknown>;
}

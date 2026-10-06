export declare enum AlertSeverityFilter {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
export declare enum AlertStatusFilter {
    FIRING = "FIRING",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    RESOLVED = "RESOLVED",
    SUPPRESSED = "SUPPRESSED"
}
export declare class AlertQueryDto {
    status?: AlertStatusFilter;
    severity?: AlertSeverityFilter;
    serviceId?: string;
    assignmentGroupId?: string;
    search?: string;
}

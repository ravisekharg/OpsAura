import { Queue } from 'bull';
export type NotificationChannel = 'email' | 'slack' | 'teams' | 'voice';
export interface DispatchPayload {
    tenantSlug: string;
    channel: NotificationChannel;
    recipient: string;
    subject: string;
    body?: string;
    alertId?: string;
    escalationId?: string;
}
export declare class NotificationDispatchService {
    private readonly queue;
    private readonly logger;
    constructor(queue: Queue);
    dispatch(payload: DispatchPayload): Promise<void>;
    dispatchAlertNotification(tenantSlug: string, alertTitle: string, severity: string, channels: NotificationChannel[], recipients: string[], alertId: string): Promise<void>;
    dispatchEscalationNotification(tenantSlug: string, escalationTitle: string, stepOrder: number, channels: NotificationChannel[], recipients: string[], escalationId: string): Promise<void>;
}

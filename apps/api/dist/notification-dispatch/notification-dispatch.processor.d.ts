import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { TenantPrismaFactory } from '../database/tenant-prisma.factory';
import type { DispatchPayload } from './notification-dispatch.service';
export declare class NotificationDispatchProcessor {
    private readonly config;
    private readonly tenantFactory;
    private readonly logger;
    constructor(config: ConfigService, tenantFactory: TenantPrismaFactory);
    private get encKey();
    handleSend(job: Job<DispatchPayload>): Promise<void>;
    private sendEmail;
    private sendSlack;
    private sendTeams;
    private sendVoice;
    private buildEmailHtml;
    private severityColor;
    private sanitizeTwiml;
    private recordDelivery;
}

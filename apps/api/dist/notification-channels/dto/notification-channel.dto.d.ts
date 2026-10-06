export declare class EmailConfigDto {
    host: string;
    port: string;
    user: string;
    password: string;
    from: string;
    tls?: boolean;
}
export declare class SlackConfigDto {
    webhookUrl: string;
    channel?: string;
}
export declare class TeamsConfigDto {
    webhookUrl: string;
}
export declare class VoiceConfigDto {
    accountSid: string;
    authToken: string;
    fromNumber: string;
}
export declare class CreateNotificationChannelDto {
    name: string;
    type: string;
    config: EmailConfigDto | SlackConfigDto | TeamsConfigDto | VoiceConfigDto;
}
declare const UpdateNotificationChannelDto_base: import("@nestjs/common").Type<Partial<CreateNotificationChannelDto>>;
export declare class UpdateNotificationChannelDto extends UpdateNotificationChannelDto_base {
}
export declare class TestNotificationChannelDto {
    recipient?: string;
}
export {};

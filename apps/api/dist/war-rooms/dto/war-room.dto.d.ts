export declare class CreateWarRoomDto {
    title: string;
    description?: string;
    severity: string;
    serviceId?: string;
    alertIds?: string[];
    templateId?: string;
}
declare const UpdateWarRoomDto_base: import("@nestjs/common").Type<Partial<CreateWarRoomDto>>;
export declare class UpdateWarRoomDto extends UpdateWarRoomDto_base {
}
export declare class AddParticipantDto {
    userId: string;
    role: string;
}
export declare class CreateActionDto {
    title: string;
    assignedUserId?: string;
    dueAt?: string;
}
export declare class UpdateActionDto {
    title?: string;
    assignedUserId?: string;
    status?: string;
    dueAt?: string;
}
export declare class AddTimelineEntryDto {
    message: string;
    type?: string;
}
export declare class CreateTemplateDto {
    name: string;
    description?: string;
    defaultRoles?: object[];
    defaultActions?: object[];
}
declare const UpdateTemplateDto_base: import("@nestjs/common").Type<Partial<CreateTemplateDto>>;
export declare class UpdateTemplateDto extends UpdateTemplateDto_base {
}
export {};

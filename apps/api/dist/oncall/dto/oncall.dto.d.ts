export declare class CreateScheduleDto {
    name: string;
    description?: string;
    teamId?: string;
    timezone: string;
}
export declare class UpdateScheduleDto {
    name?: string;
    description?: string;
    teamId?: string;
    timezone?: string;
    active?: boolean;
}
export declare class RotationMemberDto {
    userId: string;
    name: string;
    email: string;
    order?: number;
}
export declare class CreateRotationDto {
    scheduleId: string;
    name: string;
    type: string;
    members: RotationMemberDto[];
    handoffDay?: string;
    handoffTime?: string;
}
export declare class UpdateRotationDto {
    name?: string;
    members?: RotationMemberDto[];
    handoffDay?: string;
    active?: boolean;
}
export declare class CreateOverrideDto {
    scheduleId: string;
    originalUserId: string;
    overrideUserId: string;
    startAt: string;
    endAt: string;
    reason?: string;
}

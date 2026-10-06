export declare class CreateTeamDto {
    name: string;
    description?: string;
    leadUserId?: string;
}
export declare class UpdateTeamDto {
    name?: string;
    description?: string;
    leadUserId?: string;
}
export declare class AddMemberDto {
    userId: string;
}

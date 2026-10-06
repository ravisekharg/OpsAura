export declare class CreateSnConnectionDto {
    name: string;
    instanceUrl: string;
    username: string;
    password: string;
}
declare const UpdateSnConnectionDto_base: import("@nestjs/common").Type<Partial<CreateSnConnectionDto>>;
export declare class UpdateSnConnectionDto extends UpdateSnConnectionDto_base {
}
export declare class CreateSnMappingDto {
    connectionId: string;
    snGroupId: string;
    snGroupName?: string;
    localGroupId: string;
    autoSync?: boolean;
}
declare const UpdateSnMappingDto_base: import("@nestjs/common").Type<Partial<CreateSnMappingDto>>;
export declare class UpdateSnMappingDto extends UpdateSnMappingDto_base {
}
export {};

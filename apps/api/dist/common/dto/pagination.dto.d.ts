export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export declare function paginate<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T>;

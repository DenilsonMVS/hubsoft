export interface LaravelPaginatedResponse<T> {
    data: T[];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    current_page: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    last_page: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    per_page: number;
    total: number;
}

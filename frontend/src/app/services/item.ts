import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { IItem, IPaginatedResponse } from "../app";
import { LaravelPaginatedResponse } from "./laravelPaginatedResponse";

interface LaravelItem {
    id: string;
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    updated_at: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_at: string;
}

@Injectable({
    providedIn: "root"
})
export class ItemService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = "/api/items";

    private toFontendFriendlyFormat(item: LaravelItem): IItem {
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            updatedAt: new Date(item.updated_at),
            createdAt: new Date(item.created_at)
        };
    }

    getItems(page: number, perPage: number): Observable<IPaginatedResponse<IItem>> {
        return this.http.get<LaravelPaginatedResponse<LaravelItem>>(
            `${this.apiUrl}?page=${page}&per_page=${perPage}`
        ).pipe(
            map((response) => ({
                data: response.data.map((item) => this.toFontendFriendlyFormat(item)),
                currentPage: response.current_page,
                lastPage: response.last_page,
                perPage: response.per_page,
                total: response.total
            }))
        );
    }

    createItem(item: { title: string; description: string }): Observable<IItem> {
        return this.http.post<LaravelItem>(this.apiUrl, item).pipe(
            map((rawItem) => this.toFontendFriendlyFormat(rawItem))
        );
    }

    updateItem(id: string, item: { title: string; description: string }): Observable<IItem> {
        return this.http.put<LaravelItem>(`${this.apiUrl}/${id}`, item).pipe(
            map((rawItem) => this.toFontendFriendlyFormat(rawItem))
        );
    }

    deleteItem(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
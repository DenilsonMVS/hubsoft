import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Observable } from "rxjs";
import { ItemDetail } from "./itemDetail/itemDetail";
import { ItemList } from "./itemList/itemList";
import { ItemService } from "./services/item";
import { HttpErrorResponse } from "@angular/common/http";

export interface IPaginatedResponse<T> {
    data: T[];
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}

export interface IItem {
    id: string;
    title: string;
    description: string;
    updatedAt: Date;
    createdAt: Date;
}

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, ItemList, ItemDetail],
    templateUrl: "./app.html",
    styleUrl: "./app.css"
})
export class App implements OnInit {
    private readonly itemService = inject(ItemService);

    protected readonly isModalOpen = signal(false);
    protected readonly selectedItem = signal<IItem | null>(null);
    protected readonly items = signal<IItem[]>([]);
    protected readonly isLoading = signal(false);

    protected readonly currentPage = signal(1);
    protected readonly pageSize = signal(10);
    protected readonly totalPages = signal(1);

    ngOnInit(): void {
        this.loadItems();
    }

    private withLoading<T>(
        apiCallFn: () => Observable<T>,
        onSuccess: (result: T) => void
    ): void {
        this.isLoading.set(true);

        apiCallFn().subscribe({
            next: (result) => {
                onSuccess(result);
                this.isLoading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                const errorMessage = err.error?.message || "Ocorreu um erro ao processar a solicitação no servidor.";
                alert(`Ops! ${errorMessage}`);
                
                this.isLoading.set(false);
            }
        });
    }

    private withOptimisticUpdate<T>(
        optimisticFn: () => void,
        apiCallFn: () => Observable<T>,
        onSuccess?: (result: T) => void
    ): void {
        const previousItems = this.items();
        
        optimisticFn();
        this.isModalOpen.set(false);

        apiCallFn().subscribe({
            next: onSuccess,
            error: (err: HttpErrorResponse) => {
                const errorMessage = err.error?.message || "Ocorreu um erro ao processar a solicitação no servidor.";
                alert(`Ops! ${errorMessage}`);

                this.items.set(previousItems);
            }
        });
    }

    protected loadItems(): void {
        this.withLoading(
            () => this.itemService.getItems(this.currentPage(), this.pageSize()),
            (response) => {
                this.items.set(response.data);
                this.totalPages.set(response.lastPage);
            }
        );
    }

    protected onPageChange(page: number): void {
        this.currentPage.set(page);
        this.loadItems();
    }

    protected onPageSizeChange(size: number): void {
        this.pageSize.set(size);
        this.currentPage.set(1);
        this.loadItems();
    }

    protected openCreateModal(): void {
        this.selectedItem.set(null);
        this.isModalOpen.set(true);
    }

    protected openEditModal(item: IItem): void {
        this.selectedItem.set(item);
        this.isModalOpen.set(true);
    }

    protected handleSave(data: { title: string; description: string }): void {
        const currentItem = this.selectedItem();

        if (currentItem) {
            this.withOptimisticUpdate(
                () => {
                    this.items.update((items) =>
                        items.map((i) =>
                            i.id === currentItem.id
                                ? { ...i, title: data.title, description: data.description }
                                : i
                        )
                    );
                },
                () => this.itemService.updateItem(currentItem.id, data),
                () => this.silentReload(),
            );
        } else {
            const tempId = crypto.randomUUID();
            const now = new Date();
            const tempItem: IItem = { id: tempId, ...data, createdAt: now, updatedAt: now };

            this.withOptimisticUpdate(
                () => {
                    this.items.update((items) => [tempItem, ...items]);
                },
                () => this.itemService.createItem(data),
                () => this.silentReload(),
            );
        }
    }

    private silentReload(): void {
        this.itemService.getItems(this.currentPage(), this.pageSize()).subscribe({
            next: (response) => {
                this.items.set(response.data);
                this.totalPages.set(response.lastPage);
            }
        });
    }

    protected handleDeleteFromModal(): void {
        const currentItem = this.selectedItem();
        if (!currentItem) return;

        this.withOptimisticUpdate(
            () => {
                this.items.update((items) => items.filter((item) => item.id !== currentItem.id));
            },
            () => this.itemService.deleteItem(currentItem.id),
            () => this.silentReload(),
        );
    }
}
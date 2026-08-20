import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IItem } from "../app";
import { Item } from "../item/item";

@Component({
    selector: "app-item-list",
    standalone: true,
    imports: [Item, FormsModule],
    templateUrl: "./itemList.html",
    styleUrl: "./itemList.css"
})
export class ItemList {
    public readonly items = input.required<IItem[]>();
    public readonly currentPage = input.required<number>();
    public readonly totalPages = input.required<number>();
    public readonly pageSize = input.required<number>();

    public readonly itemSelect = output<IItem>();
    public readonly pageChange = output<number>();
    public readonly pageSizeChange = output<number>();

    protected readonly pageSizeOptions = [10, 20, 40];

    protected onSelect(item: IItem): void {
        this.itemSelect.emit(item);
    }

    protected onPageSizeSelect(newSize: number): void {
        this.pageSizeChange.emit(Number(newSize));
    }

    protected goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages()) {
            this.pageChange.emit(page);
        }
    }
}
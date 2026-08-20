import { DatePipe } from "@angular/common";
import { Component, input, output } from "@angular/core";

@Component({
    selector: "app-item",
    standalone: true,
    imports: [DatePipe], 
    templateUrl: "./item.html",
    styleUrl: "./item.css"
})
export class Item {
    public readonly title = input.required<string>();
    public readonly description = input.required<string>();
    public readonly updatedAt = input<Date>(new Date());

    public readonly itemSelect = output<void>();

    protected onSelect(): void {
        this.itemSelect.emit();
    }
}
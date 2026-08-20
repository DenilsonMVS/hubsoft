import { Component, effect, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IItem } from "../app";

export type DetailMode =
    | { kind: "View"; item: IItem }
    | { kind: "Edit"; item: IItem }
    | { kind: "Create" };

@Component({
    selector: "app-item-detail",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./itemDetail.html",
    styleUrl: "./itemDetail.css"
})
export class ItemDetail {
    public readonly item = input<IItem | null>(null);

    public readonly save = output<{ title: string; description: string }>();
    public readonly closeModal = output<void>();
    // Nova saída para notificar a remoção do item
    public readonly deleteItem = output<void>();

    protected mode = signal<DetailMode>({ kind: "Create" });

    protected title = signal("");
    protected description = signal("");

    constructor() {
        effect(() => {
            const currentItem = this.item();

            if (currentItem) {
                this.mode.set({ kind: "View", item: currentItem });
                this.title.set(currentItem.title);
                this.description.set(currentItem.description);
            } else {
                this.mode.set({ kind: "Create" });
                this.title.set("");
                this.description.set("");
            }
        });
    }

    protected enterEditMode(): void {
        const currentMode = this.mode();
        if (currentMode.kind === "View") {
            this.mode.set({ kind: "Edit", item: currentMode.item });
        }
    }

    protected onDelete(): void {
        this.deleteItem.emit();
    }

    protected onBackdropMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.onClose();
        }
    }

    protected onSave(): void {
        if (!this.title().trim()) return;

        this.save.emit({
            title: this.title(),
            description: this.description()
        });

        const currentMode = this.mode();
        if (currentMode.kind === "Edit") {
            const updatedItem: IItem = {
                ...currentMode.item,
                title: this.title(),
                description: this.description()
            };
            this.mode.set({ kind: "View", item: updatedItem });
        }
    }

    protected onClose(): void {
        this.closeModal.emit();
    }
}
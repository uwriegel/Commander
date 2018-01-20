import { ColumnsControl }  from './columnscontrol.js'
import { Presenter } from './presenter.js';

export interface View {
    getId(): string
    setPresenter(presenter: Presenter): void,
    ItemsCleared(): void 
    itemsChanged(lastCurrentIndex: number): void
    updateItems(): void
    updateSelections(): void
    updateSelection(itemIndex: number): void
    getCurrentItemIndex(): number
    setColumns(value: ColumnsControl): void
}

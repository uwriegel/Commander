import { ColumnsControl }  from './columnscontrol.js'

export interface View {
    ItemsCleared(): void 
    itemsChanged(lastCurrentIndex: number): void
    updateItems(): void
    updateSelections(): void
    updateSelection(itemIndex: number): void
    getCurrentItemIndex(): number
    setColumns(value: ColumnsControl): void
}

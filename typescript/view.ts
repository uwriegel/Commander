import { ColumnsControl }  from './columnscontrol'

interface View
{
    ItemsCleared(): void 
    itemsChanged(lastCurrentIndex: number): void
    updateItems(): void
    refreshSelection(itemIndex: number, isSelected: boolean): void
    getCurrentItemIndex(): number
    setColumns(value: ColumnsControl): void
}

export { View }
import { ColumnsControl }  from './columnscontrol'
import { Presenter }  from './presenter/presenter'

interface View
{
    Presenter: Presenter
    ItemsCleared(): void 
    itemsChanged(lastCurrentIndex: number): void
    updateItems(): void
    refreshSelection(itemIndex: number, isSelected: boolean): void
    getCurrentItemIndex(): number
    setColumns(value: ColumnsControl): void
}

export { View }
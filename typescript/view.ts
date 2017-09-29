import { ColumnsControl }  from './columnscontrol'
import { Presenter }  from './presenter/presenter'

interface View
{
    ItemsCleared(): void 
    itemsChanged(lastCurrentIndex: number): void
    updateItems(): void
    refreshSelection(itemIndex: number, isSelected: boolean): void
    getCurrentItemIndex(): number
    setColumns(value: ColumnsControl): void
    setPresenter(presenter: Presenter): void
}

export { View }
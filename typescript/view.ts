import { ColumnsControl }  from './columnscontrol.js'
import { Presenter }  from './presenter/presenter.js'

interface View
{
    Presenter: Presenter
    ItemsCleared(): void 
    itemsChanged(lastCurrentIndex: number): void
    updateItems(): void
    updateSelections(): void
    updateSelection(itemIndex: number): void
    getCurrentItemIndex(): number
    setColumns(value: ColumnsControl): void
}

export { View }
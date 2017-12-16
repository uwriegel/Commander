import { ColumnsControl }  from './columnscontrol.js'
import { Presenter }  from './presenter/presenter.js'

export interface View
{
    setPresenter(value: Presenter): void
    getPresenter(): Presenter
    ItemsCleared(): void 
    itemsChanged(lastCurrentIndex: number): void
    updateItems(): void
    updateSelections(): void
    updateSelection(itemIndex: number): void
    getCurrentItemIndex(): number
    setColumns(value: ColumnsControl): void
}

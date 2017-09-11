import { Presenter }  from './presenter'
import { View }  from './view'

abstract class PresenterBase implements Presenter
{
    registerView(view: View): void {
        this.view = view
        this.setColumns()
    }
    getItemsCount(): number {
        return this.items.length
    }

    insertItem(index: number, startDrag?: (() => void) | undefined): HTMLTableRowElement {
        return this.createItem(this.items[index].name)
    }

    insertMeasureItem(): HTMLTableRowElement {
        return this.createItem("T")
    }
    
    updateItem(itemElement: HTMLTableRowElement, index: number): void {
        throw new Error("Method not implemented.");
    }

    protected abstract createItem(name: string) : HTMLTableRowElement
    protected abstract setColumns(): void

    protected items: any[]
    protected view: View
}

export { PresenterBase }
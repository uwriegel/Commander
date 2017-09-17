import { Presenter }  from './presenter'
import { View }  from '../view'

export interface Item
{
}

export abstract class PresenterBase implements Presenter
{
    registerView(view: View): void {
        this.view = view
        this.setColumns()
    }
    getItemsCount(): number {
        return this.items.length
    }

    insertItem(index: number, startDrag?: (() => void) | undefined): HTMLTableRowElement {
        return this.createItem(this.items[index])
    }

    insertMeasureItem(): HTMLTableRowElement {
        return this.createItem(undefined)
    }
    
    updateItem(itemElement: HTMLTableRowElement, index: number): void {
        throw new Error("Method not implemented.");
    }

    abstract fill(path: string): Promise<void>

    protected abstract createItem(name?: Item) : HTMLTableRowElement
    protected abstract setColumns(): void

    protected items: Item[] = []
    protected view: View
}


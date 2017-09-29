import { Presenter, Item }  from './presenter'
import { View }  from '../view'
export { Item, Presenter }  from './presenter'

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

    getItem(index: number) {
        return this.items[index]
    }

    abstract getSelectedDirectory(index: number): string

    abstract checkPath(path: string): boolean

    isDefault = false

    protected static readonly itemIconNameTemplate: HTMLTableDataCellElement = 
        (document.getElementById('tableDataItemIconNameTemplate') as HTMLTemplateElement).content.querySelector('td')!
    protected static readonly itemTemplate: HTMLTableDataCellElement = 
        (document.getElementById('tableDataItemTemplate') as HTMLTemplateElement).content.querySelector('td')!
    protected static readonly itemRightTemplate: HTMLTableDataCellElement = 
        (document.getElementById('tableDataItemRightTemplate') as HTMLTemplateElement).content.querySelector('td')!

    protected abstract createItem(name?: Item) : HTMLTableRowElement
    protected abstract setColumns(): void

    protected items: Item[] = []
    protected view: View
}


import { Presenter }  from './presenter'
import { View }  from '../view'
import { Item } from '../model/item'
import { getPlatform }from '../platform/platform-creator' 
export { Presenter }  from './presenter'

export abstract class PresenterBase implements Presenter
{
    showHidden: boolean

    registerView(view: View): void {
        this.view = view
        this.setColumns()
    }

    getPath() { return this.path }
    
    getItemsCount(): number {
        return this.items.length
    }

    insertItem(index: number): HTMLTableRowElement {
        return this.createItem(this.items[index])
    }

    insertMeasureItem(): HTMLTableRowElement {
        return this.createItem(undefined)
    }
    
    updateItem(): void {
        throw new Error("Method not implemented.");
    }

    fill(path: string, selectPath?: string): Promise<void> {
        this.path = path
        return this.processFill(selectPath)
    }

    getItem(index: number) {
        return this.items[index]
    }

    abstract getSelectedPath(index: number): { selectedPath: string, currentPath: string }

    abstract checkPath(path: string): boolean

    isDefault = false

    protected abstract processFill(selectPath?: string): Promise<void>

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
    protected path: string
    protected readonly platform = getPlatform()
}


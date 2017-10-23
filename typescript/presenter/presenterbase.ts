import { Presenter }  from './presenter'
import { View }  from '../view'
import { Item } from '../model/item'
//import { getPlatform }from '../platform/platform-creator' 
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
    
    updateSelection(itemElement: HTMLTableRowElement, index: number) {
        const item = this.items[index]
        if (item.isSelected)
            itemElement.classList.add("selected")
        else
            itemElement.classList.remove("selected")
    }

    updateItem(_: HTMLTableRowElement, __: number) {
    }

    fill(path: string, selectPath?: string): Promise<void> {
        this.path = path
        return this.processFill(selectPath)
    }

    getItem(index: number) {
        return this.items[index]
    }

    /**
     * Einschränken der Anzeige der Einträge auf die Beschränkten.
     * @param prefix Der eingegebene Prefix zur Beschänkung
     * @param back Im Prefix um einen Buchstaben zurückgehen
     * @returns true: Es wird restriktiert
     */
    restrict(prefix: string, back?: boolean): boolean {

        if (this.originalItems.length == 0) 
            this.originalItems = this.items

        var restrictedItems: Item[] = []
        if (back)
            this.items = this.originalItems
        this.items.forEach((item) => {
            if (item.displayName.toLowerCase().indexOf(prefix) == 0)
                restrictedItems.push(item)
        })

        if (restrictedItems.length > 0) {
            this.items = restrictedItems

            this.view.itemsChanged(0)
            return true
        }
        return false
    }

    /**
     * Die Beschränkung aufheben
     * @param noRefresh
     */
    closeRestrict(noRefresh: boolean) {
        this.items = this.originalItems
        this.originalItems = []
        if (!noRefresh)
            this.view.itemsChanged(0)
    }

    abstract getSelectedPath(index: number): { selectedPath: string, currentPath: string }

    abstract checkPath(path: string): boolean

    isDefault = false

    sort(_: number, __: boolean) {
        return false
    }

    toggleSelection(itemIndex: number) {
        if (!this.canBeSelected(itemIndex))
            return

        this.items[itemIndex].isSelected = !this.items[itemIndex].isSelected

        this.view.updateSelection(itemIndex)
    }        

    selectAll(select: boolean, startIndex?: number) {
        this.items.forEach((item, index) => {
            if (this.canBeSelected(index)) 
                item.isSelected = (!startIndex || index >= startIndex) ? select : !select
        })
        this.view.updateSelections()
    }
   
    protected canBeSelected(_: number) {
        return false
    }
    
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
    protected readonly platform: any = 3
    protected sortAscending = true
    private originalItems: Item[] = []        
}


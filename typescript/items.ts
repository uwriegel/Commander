import { Item } from './item.js'
import { View } from './view.js'

export interface Items {
    getPath: ()=>string,
    getItem: (index: number)=>Item,

    // TODO: hier nicht!
    updateItem: (tr: HTMLTableRowElement, index: number)=>void
    updateSelection: (itemElement: HTMLTableRowElement, index: number)=>void
    insertMeasureItem: ()=>HTMLTableRowElement
    insertItem: (index: number)=>HTMLTableRowElement
    getItemsCount: ()=>number

    getSelectedPath: (index: number)=>{ selectedPath: string, currentPath: string }, 
    restrict: (prefix: string, back?: boolean)=>boolean
    closeRestrict: (noRefresh: boolean)=>void,
    selectAll: (select: boolean, startIndex?: number)=>void,
    toggleSelection: (itemIndex: number)=>void
}

export function createItems(view: View) {
    function getPath() {
        return ""
    }

    function getItem(index: number) {
        return items[index]
    }

    function getSelectedPath(index: number) { 
        return {
            selectedPath: "", 
            currentPath: "" 
        }
    }

    function updateItem(_: HTMLTableRowElement, __: number) { }

    // TODO: hier nicht!
    function updateSelection(itemElement: HTMLTableRowElement, index: number) {
        const item = items[index]
        if (item.isSelected)
            itemElement.classList.add("selected")
        else
            itemElement.classList.remove("selected")
    }

    function insertMeasureItem(): HTMLTableRowElement {
        //return createItem(undefined)
        return undefined
    }

    function getItemsCount(): number {
        return items.length
    }

    function insertItem(index: number): HTMLTableRowElement {
        //return createItem(items[index])
        return undefined
    }

    /**
     * Einschränken der Anzeige der Einträge auf die Beschränkten.
     * @param prefix Der eingegebene Prefix zur Beschänkung
     * @param back Im Prefix um einen Buchstaben zurückgehen
     * @returns true: Es wird restriktiert
     */
    function restrict(prefix: string, back?: boolean): boolean {
        if (originalItems.length == 0) 
            originalItems = items

        var restrictedItems: Item[] = []
        if (back)
            items = originalItems
        items.forEach((item) => {
            if (item.displayName.toLowerCase().indexOf(prefix) == 0)
                restrictedItems.push(item)
        })

        if (restrictedItems.length > 0) {
            items = restrictedItems

            view.itemsChanged(0)
            return true
        }
        return false
    }

    /**
     * Die Beschränkung aufheben
     * @param noRefresh
     */
    function closeRestrict(noRefresh: boolean) {
        items = originalItems
        originalItems = []
        if (!noRefresh)
            view.itemsChanged(0)
    }
    
    function toggleSelection(itemIndex: number) {
        if (!canBeSelected(itemIndex))
             return

        items[itemIndex].isSelected = !items[itemIndex].isSelected
        view.updateSelection(itemIndex)
    }        

    function selectAll(select: boolean, startIndex?: number) {
        items.forEach((item, index) => {
            if (canBeSelected(index)) 
                item.isSelected = (!startIndex || index >= startIndex) ? select : !select
        })
        view.updateSelections()
    }

    function canBeSelected(index: number) {
        // TODO:
        return true
    }

    var items: Item[] = []
    var originalItems: Item[] = []

    return { 
        getPath: getPath,
        getItem: getItem,
        updateItem: updateItem,
        updateSelection: updateSelection,
        insertMeasureItem: insertMeasureItem,
        insertItem: insertItem,
        getItemsCount: getItemsCount,
        getSelectedPath: getSelectedPath,
        restrict: restrict,
        closeRestrict: closeRestrict,
        selectAll: selectAll,
        toggleSelection: toggleSelection
    }
}
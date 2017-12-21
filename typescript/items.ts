import { Item } from './item.js'
import { View } from './view.js'

export interface Items {
    getPath: ()=>string,
    getItem: (index: number)=>Item,
    getItemsCount: ()=>number
    getSelectedPath: (index: number)=>{ selectedPath: string, currentPath: string }, 
    restrict: (prefix: string, back?: boolean)=>boolean
    closeRestrict: (noRefresh: boolean)=>void,
    selectAll: (select: boolean, startIndex?: number)=>void,
    toggleSelection: (itemIndex: number)=>void
}

export function createEmptyItems() {
    return {
        getPath: ()=>"",
        getItem: (index: number)=>{ throw "no items"},
        getItemsCount: ()=>0,
        getSelectedPath: (index: number)=>{ return { selectedPath: "", currentPath: "" }},
        restrict: (prefix: string, back?: boolean)=>false,
        closeRestrict: (noRefresh: boolean)=>{},
        selectAll: (select: boolean, startIndex?: number)=>{},
        toggleSelection: (itemIndex: number)=>{}
    }
}

export async function createItems(view: View, path: string, selectPath?: string) {
    function getPath() {
        return path
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

    function getItemsCount(): number {
        return items.length
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
        getItemsCount: getItemsCount,
        getSelectedPath: getSelectedPath,
        restrict: restrict,
        closeRestrict: closeRestrict,
        selectAll: selectAll,
        toggleSelection: toggleSelection
    }
}
import { platform, Platform } from './platform.js'
import { View } from './view.js'
import { createColumnsControl } from './columnscontrol.js'
import { Item } from './item.js'

export interface Presenter {
    getType: ()=>Type
    updateItem: (tr: HTMLTableRowElement, item: Item)=>void
    updateSelection: (itemElement: HTMLTableRowElement, item: Item)=>void
    insertMeasureItem: ()=>HTMLTableRowElement
    insertItem: (item: Item)=>HTMLTableRowElement
}

enum Type {
    Root,
    Directory
}

const Columns = (function() {
    const result = [] 
    result[Type.Root] = platform == Platform.Linux ? ["Name", "Beschreibung", "Mount", "Größe", "Typ"] : ["Name", "Beschreibung", "Größe"]
    result[Type.Directory] = ["Name"]
    return result
})()

export function checkPresenter(path: string, currentPresenter: Presenter | undefined, view: View) {
    const newType = whichType(path)
    if (currentPresenter && currentPresenter.getType() == newType)
        return currentPresenter
    const type = newType
    
    const createColumns = createColumnsControl(view.getId())(type.toString())
    const columnsControl = createColumns(Columns[type])
    view.setColumns(columnsControl)

    function whichType(path: string) {
        if (path == "root") 
            return Type.Root
        else
            return Type.Directory
    }

    const getType = () => type

    function updateItem(_: HTMLTableRowElement, item: Item) { }

    function updateSelection(itemElement: HTMLTableRowElement, item: Item) {
        //const item = items[index]
        if (item.isSelected)
            itemElement.classList.add("selected")
        else
            itemElement.classList.remove("selected")
    }

    function insertMeasureItem(): HTMLTableRowElement {
        //return createItem(undefined)
        return undefined
    }
    function insertItem(item: Item): HTMLTableRowElement {
        //return createItem(items[index])
        return undefined
    }

    return {
        getType: getType,
        updateItem: updateItem,
        updateSelection: updateSelection,
        insertMeasureItem: insertMeasureItem,
        insertItem: insertItem
    }
}
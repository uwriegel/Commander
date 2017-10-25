import { Menubar } from "./menubar.js"
import { MenuItemControl } from "./menuitemcontrol.js"

export enum MenuItemType {
    MenuItem,
    Checkable,
    Separator
}

export interface Shortcut {
    display: string
    key: number
    shift?: boolean
    alt?: boolean
    ctrl?: boolean
}

export interface ShortCutAction {
    callAction?: ()=>void
}

export interface MenuItem {
    name?: string
    type?: MenuItemType
    shortcut?: Shortcut
    action?: (menuItemControl: MenuItemControl)=>void
}

export class Menu {
    constructor(private menubar: HTMLElement, private actions: Map<string, ()=>void>, private shortcuts: Shortcut[]) {
        this.table = document.createElement("table")
        this.table.classList.add("submenu")
        this.table.classList.add("hidden")
        this.menubar.appendChild(this.table)

        const tableBody = document.createElement("tbody")
        this.table.appendChild(tableBody)
    }

    appendItem(item : MenuItem) {
        const tableBody = this.table.querySelector("tbody")!
        const tr = document.createElement("tr")

        const td = document.createElement("td")
        if (item.type != MenuItemType.Separator) {
            tr.tabIndex = ++Menu.latestTabIndex
            tr.classList.add("selectable")
            Menubar.insertAcceleratableItem(td, item.name!, item.type == MenuItemType.Checkable)
        }
        else {
            tr.classList.add("separator")
            td.colSpan = 2
            const div = document.createElement("div")
            td.appendChild(div)
        }

        tr.appendChild(td)

        const checker = item.type == MenuItemType.Checkable ? tr.querySelector(".checker") as HTMLSpanElement : undefined
        const result = new MenuItemControl(checker)

        if (item.type != MenuItemType.Separator) {
            const td2 = document.createElement("td")
            if (item.shortcut) 
                td2.innerText = item.shortcut.display
            tr.appendChild(td2)
        }

        if (item.action) {
            const id = (++Menu.latestItemIndex).toString()
            tr.dataset["id"] = id

            const action = item.type == MenuItemType.Checkable ? () => {
                result.isChecked = !result.isChecked
                item.action!(result)  
            } 
            : () => item.action!(result)
            
            this.actions.set(id, action)

            if (item.shortcut) {
                item.shortcut.alt = item.shortcut.alt ? true: false
                item.shortcut.ctrl = item.shortcut.ctrl ? true: false
                item.shortcut.shift = item.shortcut.shift ? true: false
                const actionItem = item.shortcut as ShortCutAction
                actionItem.callAction = action
                this.shortcuts.push(item.shortcut)                
            }
        }

        tableBody.appendChild(tr)
        return result
    }
    
    private static latestItemIndex = 0
    private static latestTabIndex = 0
    private readonly table: HTMLTableElement
}
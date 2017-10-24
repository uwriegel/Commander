import { Menubar } from "./menubar.js"

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

export interface MenuItem {
    name?: string
    type?: MenuItemType
    shortcut?: Shortcut
}

export class Menu {
    constructor(private menubar: HTMLElement) {
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
            Menubar.insertAcceleratableItem(td, item.name!)
        }
        else {
            tr.classList.add("separator")
            td.colSpan = 2
            const div = document.createElement("div")
            td.appendChild(div)
        }

        tr.appendChild(td)

        if (item.type != MenuItemType.Separator) {
            const td2 = document.createElement("td")
            if (item.shortcut) 
                td2.innerText = item.shortcut.display
            tr.appendChild(td2)
        }

        tableBody.appendChild(tr)
    }
    
    private static latestTabIndex = 0
    private readonly table: HTMLTableElement
}
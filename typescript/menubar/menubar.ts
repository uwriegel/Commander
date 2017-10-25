import { Menu, Shortcut, ShortCutAction } from "./menu.js"
import { SubMenuController } from "./submenucontroller.js"
export { Menu, MenuItemType } from "./menu.js"

export class Menubar {
    constructor(parentId: string) {
        this.menuElement  = document.getElementById(parentId)!
        this.menuElement.classList.add("menuParent")
        this.menubarContainer = document.createElement("ul")
        this.menubarContainer.classList.add("menubar")
        this.menuElement.appendChild(this.menubarContainer)

        this.menuElement.addEventListener("focusout", evt => {
            if (!(this.subMenuOpened && this.keyboardActivated) && !this.menuElement.contains((<any>evt).relatedTarget))
                this.close()
        })

        this.initializeMouseHandler()
        this.initializeKeyHandler()
    }

    insertItem(item: string) {
        const li = document.createElement("li")
        li.tabIndex = ++Menubar.latestTabIndex
        li.dataset["id"] = this.menubarContainer.childElementCount.toString()
        this.menubarContainer.appendChild(li)
        Menubar.insertAcceleratableItem(li, item, false)
        return new Menu(this.menuElement, this.actions, this.shortcuts)
    }

    static insertAcceleratableItem(element: HTMLElement, item: string, isCheckable: boolean) {
        const acceleratorPos = item.indexOf("_")
        if (acceleratorPos != -1) {
            if (acceleratorPos > 0) {
                const preSpan = document.createElement("span")        
                preSpan.innerText = item.substring(0, acceleratorPos)
                element.appendChild(preSpan)
            }
            const acceleratorSpan = document.createElement("span")        
            acceleratorSpan.innerText = item.substr(acceleratorPos + 1, 1)
            acceleratorSpan.classList.add("accelerator")
            element.appendChild(acceleratorSpan)
            const span = document.createElement("span")        
            span.innerText = item.substring(acceleratorPos + 2)
            element.appendChild(span)
            if (isCheckable) {
                const span = document.createElement("span")        
                span.innerText = '✓'
                span.classList.add("checker")
                span.classList.add("hidden")
                element.appendChild(span)
            }
        }
        else {
            const span = document.createElement("span")        
            span.innerText = item
            element.appendChild(span)
        }
    }

    private initializeMouseHandler() {
        this.menubarContainer.onmousedown = evt => {
            var li = <HTMLLIElement>(<HTMLElement>evt.target).closest("li")
            var selected = false
            if (li.classList.contains("selected"))
                selected = true

            if (!this.isActive)
                this.setActive()

            this.subMenuOpened = true

            this.clearSelection()
            if (!selected)
                this.focusLi(li)
            else {
                this.close()
                evt.stopPropagation()
                evt.preventDefault()
            }
        }
    }

    private initializeKeyHandler() {
        document.addEventListener("keydown", evt => {
            if (!this.isActive && evt.which == 18) { // Alt
                this.menuElement.classList.add("keyboardActivated")
                this.keyboardActivated = true
            }

            if (this.keyboardActivated && evt.which != 18) { // Alt
                const accs = <HTMLSpanElement[]>Array.from(this.menuElement.querySelectorAll(".keyboardActivated .accelerator"))
                const acc = accs.find(n => n.innerText.toLowerCase() == evt.key)
                if (acc) {
                    if (!this.isActive)
                        this.acceleratorInitiated = true
                    const element = acc.parentElement
                    if (element && element.nodeName == "LI") {
                        let li = element as HTMLLIElement
                        this.setActive()
                        this.setSubMenuOpened()
                        this.clearSelection()
                        this.focusLi(li)
                        evt.stopPropagation()
                        evt.preventDefault()
                        return
                    }
                }
                else if(!this.isActive)
                    this.close()
            }
            
            if (!this.isActive) {
                if (this.processShortcuts(evt)) {
                    evt.stopPropagation()
                    evt.preventDefault()
                }
                return
            }

            switch (evt.which) {
                case 9: // TAB
                    this.close()
                    break
                case 13: // Enter
                    if (this.openedSubMenu)
                        this.openedSubMenu.onEnter()
                    else if ((<HTMLElement>evt.target).nodeName == "LI") {
                        this.keyboardActivated = true
                        this.setSubMenuOpened()
                        let li = <HTMLLIElement>this.menuElement.querySelector(".menubar>li.selected")
                        this.focusLi(li)
                    }
                    break;
                case 18: // alt
                    break
                case 27: // ESC
                    this.close()
                    break
                case 37: {// <-
                        if (this.openedSubMenu) {
                            this.openedSubMenu.close()
                            this.openedSubMenu = undefined
                        }
                        let li = <HTMLLIElement>this.menuElement.querySelector(".menubar>li.selected")
                        const lis = <HTMLLIElement[]>Array.from(this.menuElement.querySelectorAll(".menubar>li"))
                        const i = (lis).findIndex(n => n == li)
                        li = lis[i-1]
                        if (!li)
                            li = lis[lis.length - 1]
                        this.clearSelection()
                        this.focusLi(li)
                    }
                    break
                case 38: //  |^
                    if (this.openedSubMenu)
                        this.openedSubMenu.onKeyUp()
                    break;
                case 39: { // ->
                        if (this.openedSubMenu) {
                            this.openedSubMenu.close()
                            this.openedSubMenu = undefined
                        }
                        let li = <HTMLLIElement>this.menuElement.querySelector(".menubar>li.selected + li")
                        if (!li)
                            li = <HTMLLIElement>this.menuElement.querySelector(".menubar>li")
                        this.clearSelection()
                        this.focusLi(li)
                    }
                    break;
                case 40: //  |d
                    {
                        if ((<HTMLElement>evt.target).nodeName == "LI") {
                            this.keyboardActivated = true
                            this.setSubMenuOpened()
                            let li = <HTMLLIElement>this.menuElement.querySelector(".menubar>li.selected")
                            this.focusLi(li)
                        }
                        else if (this.openedSubMenu)
                            this.openedSubMenu.onKeyDown()
                    }
                    break;
                default:
                    if (this.openedSubMenu)
                        this.openedSubMenu.onKey(evt.key)
                    break
            }
            evt.stopPropagation()
            evt.preventDefault()
        }, true)
   
        document.onkeyup = evt => {
            switch (evt.which) {
                case 18: // alt
                    if (!this.hasFocus && this.keyboardActivated) {
                        this.clearSelection()
                        this.setActive()
                        let li = <HTMLLIElement>this.menuElement.querySelector(".menubar>li:first-Child")
                        this.focusLi(li)
                    }
                    else if (this.acceleratorInitiated)
                        this.acceleratorInitiated = false
                    else
                        this.close()
                    break
            }
        }        
    }

    private processShortcuts(evt: KeyboardEvent) {
        const shortcut = this.shortcuts.find(n => n.key == evt.which && n.alt == evt.altKey && n.ctrl == evt.ctrlKey && n.shift == evt.shiftKey)
        if (shortcut) {
            const actionItem = shortcut as ShortCutAction
            actionItem.callAction!()
            return true
        }
        return false
    }
    
    private setActive() {
//        this.focusedView = commanderInstance.getFocused()
        let lis = <HTMLLIElement[]>Array.from(this.menubarContainer.querySelectorAll(".menubar>li"))
        lis.forEach(n => {
            n.onmouseover = evt => {
                if (this.keyboardActivated) {
                    this.close()

                    const li = <HTMLLIElement>(<HTMLElement>evt.target).closest("li")
                    let selected = false
                    if (li.classList.contains("selected"))
                        selected = true

                    if (!this.isActive)
                        this.setActive()

                    this.subMenuOpened = true

                    this.clearSelection()
                    if (!selected)
                        this.focusLi(li)
                    else
                        this.close()
                    return
                }
                    
                this.clearSelection()
                this.focusLi(<HTMLLIElement>evt.currentTarget)
            }
        })
        this.hasFocus = true
    }
    
    private focusLi(li: HTMLLIElement) {
        li.classList.add("selected")
        li.focus()
        this.isActive = true

        if (!this.subMenuOpened)
            return
        this.closeSubMenus()

        const index = Number.parseInt(li.dataset["id"]!)
        this.openSubMenu(li.offsetLeft, li.offsetHeight, index, this.keyboardActivated)
    }

    private openSubMenu(offsetLeft: number, offsetTop: number, index: number, keyboardActivated: boolean) {
        let table = this.menuElement.children[index + 1]as HTMLTableElement
        table.style.left = `${offsetLeft}px`
        table.style.top = `${offsetTop}px`
        table.classList.remove("hidden")
        if (this.subMenuOpened) {
            if (this.openedSubMenu)
                this.openedSubMenu.close()
            this.openedSubMenu = new SubMenuController(table, this.actions, keyboardActivated, () => this.close())
        }
    }

    private setSubMenuOpened() {
        this.menubarContainer.classList.add("subMenuOpened")
        this.subMenuOpened = true
    }

    private setSubMenuClosed() {
        this.menubarContainer.classList.remove("subMenuOpened")
        this.subMenuOpened = false
    }
    
    private closeSubMenus() {
        let subs = Array.from(document.getElementsByClassName("submenu"))
        subs.forEach(n => n.classList.add("hidden"))
    }

    private clearSelection() {
        Array.from(this.menubarContainer.querySelectorAll(".menubar>li")).forEach(n => n.classList.remove("selected"))
    }

    private close() {
        this.closeSubMenus()
        this.menuElement.classList.remove("keyboardActivated")
        this.keyboardActivated = false;
        this.clearSelection()
        this.hasFocus = false
        this.isActive = false
        this.acceleratorInitiated = false
        this.setSubMenuClosed()
        if (this.openedSubMenu)
            this.openedSubMenu.close()
        this.openedSubMenu = undefined
        let lis = <HTMLLIElement[]>Array.from(this.menubarContainer.querySelectorAll(".menubar>li"))
        lis.forEach(n => (n.onmouseover as any) = null)
        //setTimeout(() => this.focusedView.focus(), 100)
    }

    private static latestTabIndex = 0
    private readonly menuElement: HTMLElement
    private readonly menubarContainer: HTMLUListElement
    private subMenuOpened = false
    private isActive = false
    private hasFocus = false
    private keyboardActivated = false
    private acceleratorInitiated = false
    private openedSubMenu?: SubMenuController
    private actions = new Map<string, ()=>void>()
    private shortcuts: Shortcut[] = []
}
 
import { Menu } from "./menu.js"
export { Menu, MenuItemType } from "./menu.js"

export class Menubar {
    constructor(parentId: string) {
        this.menuElement  = document.getElementById(parentId)!
        this.menuElement.classList.add("menuParent")
        this.menubarContainer = document.createElement("ul")
        this.menubarContainer.classList.add("menubar")
        this.menuElement.appendChild(this.menubarContainer)

        this.initializeMouseHandler()
    }

    insertItem(item: string) {
        const li = document.createElement("li")
        li.tabIndex = ++Menubar.latestTabIndex
        li.dataset["id"] = this.menubarContainer.childElementCount.toString()
        this.menubarContainer.appendChild(li)
        Menubar.insertAcceleratableItem(li, item)
        return new Menu(this.menuElement)
    }

    static insertAcceleratableItem(element: HTMLElement, item: string) {
        const acceleratorPos = item.indexOf("_")
        if (acceleratorPos != -1) {
            if (acceleratorPos > 0) {
                const preSpan = document.createElement("span")        
                preSpan.innerText = item.substring(0, acceleratorPos)
                element.appendChild(preSpan)
            }
            const acceleratorSpan = document.createElement("span")        
            acceleratorSpan.innerText = item.substr(acceleratorPos + 1, 1)
            element.appendChild(acceleratorSpan)
            const span = document.createElement("span")        
            span.innerText = item.substring(acceleratorPos + 2)
            element.appendChild(span)
        }
        else {
            const span = document.createElement("span")        
            span.innerText = item
            element.appendChild(span)
        }
    }

    private initializeMouseHandler()
    {
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
        // if (this.subMenuOpened)
        // {
        //     if (this.openedSubMenu)
        //         this.openedSubMenu.close()
        //     this.openedSubMenu = new SubMenu(menuId, keyboardActivated, () => this.close())
        // }
    }

    private closeSubMenus()
    {
        let subs = Array.from(document.getElementsByClassName("submenu"))
        subs.forEach(n => n.classList.add("hidden"))
    }

    private clearSelection() {
        Array.from(this.menubarContainer.querySelectorAll(".menubar>li")).forEach(n => n.classList.remove("selected"))
    }

    private close()
    {
        this.closeSubMenus()
        this.menubarContainer.classList.remove("keyboardActivated")
        this.keyboardActivated = false;
        this.clearSelection()
        this.hasFocus = false
        this.isActive = false
        this.acceleratorInitiated = false
        // this.setSubMenuClosed()
        // if (this.openedSubMenu)
        //     this.openedSubMenu.close()
        // this.openedSubMenu = null
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
    //private openedSubMenu: SubMenu
}
 
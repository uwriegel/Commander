
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
        this.menubarContainer.appendChild(li)

        const acceleratorPos = item.indexOf("_")
        if (acceleratorPos != -1) {
            if (acceleratorPos > 0) {
                const preSpan = document.createElement("span")        
                preSpan.innerText = item.substring(0, acceleratorPos)
                li.appendChild(preSpan)
            }
            const acceleratorSpan = document.createElement("span")        
            acceleratorSpan.innerText = item.substr(acceleratorPos + 1, 1)
            li.appendChild(acceleratorSpan)
            const span = document.createElement("span")        
            span.innerText = item.substring(acceleratorPos + 2)
            li.appendChild(span)
        }
        else {
            const span = document.createElement("span")        
            span.innerText = item
            li.appendChild(span)
        }
    }

    private initializeMouseHandler()
    {
        this.menubarContainer.onmousedown = evt => {
            var li = <HTMLLIElement>(<HTMLElement>evt.target).closest("li")
            var selected = false
            if (li.classList.contains("selected"))
                selected = true

            // if (!this.isActive)
            //     this.setActive()

//            this.subMenuOpened = true

            this.clearSelection()
            if (!selected)
                this.focusLi(li)
            else {
//                this.close()
                evt.stopPropagation()
                evt.preventDefault()
            }
        }
    }

    private focusLi(li: HTMLLIElement) {
        li.classList.add("selected")
        li.focus()
//        this.isActive = true

        // if (!this.subMenuOpened)
        //     return
//        this.closeSubMenus()

        // var subMenuId: string
        // switch (li.id)
        // {
        //     case "menubar1":
        //         subMenuId = "submenu1"
        //         break;
        //     case "menubar2":
        //         subMenuId = "submenu2"
        //         break;
        //     case "menubar3":
        //         subMenuId = "submenu3"
        //         break;
        //     case "menubar4":
        //         subMenuId = "submenu4"
        //         break;
        // }
  //      this.openSubMenu(li.offsetLeft, subMenuId, this.keyboardActivated)
    }

    private clearSelection() {
        Array.from(this.menubarContainer.querySelectorAll(".menubar>li")).forEach(n => n.classList.remove("selected"))
    }

    private static latestTabIndex = 0
    private readonly menuElement: HTMLElement
    private readonly menubarContainer: HTMLUListElement
}
class MenuBar
{
    constructor()
    {
        this.menuBar = <HTMLUListElement>document.getElementById("menubar")
        this.menuBar.addEventListener("focusout", evt =>
        {
            if (!(this.subMenuOpened && this.keyboardActivated) && !this.menuBar.contains((<any>evt).relatedTarget))
                this.close()
        })

        this.initializeMouseHandler()
        this.initializeKeyHandler()
    }

    private initializeMouseHandler()
    {
        this.menuBar.onmousedown = evt =>
        {
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
            else
            {
                this.close()
                evt.stopPropagation()
                evt.preventDefault()
            }
        }
    }

    private initializeKeyHandler()
    {
        document.addEventListener("keydown", evt =>
        {
            if (!this.isActive && evt.which == 18) // Alt
            {
                this.menuBar.classList.add("keyboardActivated")
                this.keyboardActivated = true
            }

            if (this.keyboardActivated && evt.which != 18) // Alt
            {
                let accs = <HTMLSpanElement[]>Array.from(this.menuBar.querySelectorAll(".keyboardActivated .accelerator"))
                let acc = accs.find(n => n.innerText.toLowerCase() == evt.key)
                if (acc)
                {
                    if (!this.isActive)
                        this.acceleratorInitiated = true
                    let li = <HTMLLIElement>acc.parentElement
                    this.setActive()
                    this.setSubMenuOpened()
                    this.clearSelection()
                    this.focusLi(li)
                    evt.stopPropagation()
                    evt.preventDefault()
                    return;
                }
                else if(!this.isActive)
                    this.close()
            }
            
            if (!this.isActive)
                return;

            switch (evt.which)
            {
                case 9: // TAB
                    this.close()
                    break
                case 13: // Enter
                    if (this.openedSubMenu)
                        this.openedSubMenu.onEnter()
                    break;
                case 18:
                    break
                case 27: // ESC
                    this.close()
                    break
                case 37: // <-
                    {
                        if (this.openedSubMenu)
                        {
                            this.openedSubMenu.close()
                            this.openedSubMenu = null
                        }
                        let li = <HTMLLIElement>this.menuBar.querySelector("#menubar>li.selected")
                        let lis = <HTMLLIElement[]>Array.from(this.menuBar.querySelectorAll("#menubar>li"))
                        var i = (lis).findIndex(n => n == li)
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
                case 39:// ->
                    {
                        if (this.openedSubMenu)
                        {
                            this.openedSubMenu.close()
                            this.openedSubMenu = null
                        }
                        let li = <HTMLLIElement>this.menuBar.querySelector("#menubar>li.selected + li")
                        if (!li)
                            li = <HTMLLIElement>this.menuBar.querySelector("#menubar>li")
                        this.clearSelection()
                        this.focusLi(li)
                    }
                    break;
                case 40: //  |d
                    {
                        if ((<HTMLElement>evt.target).nodeName == "LI")
                        {
                            this.keyboardActivated = true
                            this.setSubMenuOpened()
                            let li = <HTMLLIElement>this.menuBar.querySelector("#menubar>li.selected")
                            this.focusLi(li)
                        }
                        else if (this.openedSubMenu)
                            this.openedSubMenu.onKeyDown()
                    }
                    break;
                default:
                    if (this.openedSubMenu)
                        this.openedSubMenu.onKey(evt.key)
                    break;
            }
            evt.stopPropagation()
            evt.preventDefault()
        }, true)

        document.onkeyup = evt =>
        {
            switch (evt.which)
            {
                case 18: // alt
                    if (!this.hasFocus && this.keyboardActivated)
                    {
                        this.clearSelection()
                        this.setActive()
                        let li = <HTMLLIElement>this.menuBar.querySelector("#menubar>li:first-Child")
                        this.focusLi(li)
                    }
                    else if (this.acceleratorInitiated)
                        this.acceleratorInitiated = false
                    else
                        this.close()
                    break;
            }
        }
    }

    private setActive()
    {
        this.focusedView = commanderInstance.getFocused()
        let lis = <HTMLLIElement[]>Array.from(this.menuBar.querySelectorAll("#menubar>li"))
        lis.forEach(n => 
        {
            n.onmouseover = evt =>
            {
                if (this.keyboardActivated)
                {
                    this.close()

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

    private setSubMenuOpened()
    {
        this.menuBar.classList.add("subMenuOpened")
        this.subMenuOpened = true
    }

    private setSubMenuClosed()
    {
        this.menuBar.classList.remove("subMenuOpened")
        this.subMenuOpened = false
    }

    private clearSelection()
    {
        Array.from(this.menuBar.querySelectorAll("#menubar>li")).forEach(n => n.classList.remove("selected"))
    }

    private focusLi(li: HTMLLIElement)
    {
        li.classList.add("selected")
        li.focus()
        this.isActive = true

        if (!this.subMenuOpened)
            return
        this.closeSubMenus()

        var subMenuId: string
        switch (li.id)
        {
            case "menubar1":
                subMenuId = "submenu1"
                break;
            case "menubar2":
                subMenuId = "submenu2"
                break;
            case "menubar3":
                subMenuId = "submenu3"
                break;
            case "menubar4":
                subMenuId = "submenu4"
                break;
        }
        this.openSubMenu(li.offsetLeft, subMenuId, this.keyboardActivated)
    }

    private close()
    {
        this.closeSubMenus()
        this.menuBar.classList.remove("keyboardActivated")
        this.keyboardActivated = false;
        this.clearSelection()
        this.hasFocus = false
        this.isActive = false
        this.acceleratorInitiated = false
        this.setSubMenuClosed()
        if (this.openedSubMenu)
            this.openedSubMenu.close()
        this.openedSubMenu = null
        let lis = <HTMLLIElement[]>Array.from(this.menuBar.querySelectorAll("#menubar>li"))
        lis.forEach(n => n.onmouseover = null)
        setTimeout(() => this.focusedView.focus(), 100)
    }

    private openSubMenu(offsetLeft: number, menuId: string, keyboardActivated: boolean)
    {
        let submenu = document.getElementById(menuId)
        submenu.style.left = `${offsetLeft}px`
        submenu.classList.remove("hidden")
        if (this.subMenuOpened)
        {
            if (this.openedSubMenu)
                this.openedSubMenu.close()
            this.openedSubMenu = new SubMenu(menuId, keyboardActivated, () => this.close())
        }
    }

    private closeSubMenus()
    {
        let subs = Array.from(document.getElementsByClassName("submenu"))
        subs.forEach(n => n.classList.add("hidden"))
    }

    private menuBar: HTMLUListElement
    private hasFocus: boolean
    private focusedView: CommanderView
    private isActive: boolean
    private keyboardActivated: boolean
    private acceleratorInitiated: boolean
    private altPressed: boolean
    private subMenuOpened: boolean
    private openedSubMenu: SubMenu
}
export class SubMenuController {
    constructor(private subMenu: HTMLTableElement, keyboardActivated: boolean, private closeMenu: () => void) {
        if (keyboardActivated) {
            this.subMenu.classList.add("keyboardActivated")
            let tr = this.subMenu.querySelector("tr")!
            this.focusTr(tr)
        }
        this.subMenu.addEventListener("focusout", this.onFocusOut)
        this.initializeMouseHandler()

        // if (subMenuId == "submenu4") {
        //     var trCheck = document.querySelector("#menuShowHidden .checker")
        //     if (localStorage["showHidden"] == "true")
        //         trCheck.classList.remove("hidden")
        //     else
        //         trCheck.classList.add("hidden")

        //     trCheck = document.querySelector("#menuDarkTheme .checker")
        //     if (localStorage["darkTheme"] == "true")
        //         trCheck.classList.remove("hidden")
        //     else
        //         trCheck.classList.add("hidden")
        // }
    }

    onKeyDown() {
        let tr = <HTMLTableRowElement>this.subMenu.querySelector("tr.selected")
        let trs = <HTMLTableRowElement[]>Array.from(this.subMenu.querySelectorAll("tr.selectable"))
        var i = (trs).findIndex(n => n == tr)
        tr = trs[i + 1]
        if (!tr)
            tr = trs[0]
        this.clearSelection()
        this.focusTr(tr)
    }

    onKeyUp() {
        let tr = <HTMLTableRowElement>this.subMenu.querySelector("tr.selected")
        let trs = <HTMLTableRowElement[]>Array.from(this.subMenu.querySelectorAll("tr.selectable"))
        var i = (trs).findIndex(n => n == tr)
        tr = trs[i - 1]
        if (!tr)
            tr = trs[trs.length - 1]
        this.clearSelection()
        this.focusTr(tr)
    }

    onEnter() {
        let tr = <HTMLTableRowElement>this.subMenu.querySelector("tr.selected")
        if (tr)
            this.onExecute(tr)
    }

    onKey(key: string) {
        let accs = <HTMLSpanElement[]>Array.from(this.subMenu.querySelectorAll(".accelerator"))
        let acc = accs.find(n => n.innerText.toLowerCase() == key)
        if (acc) {
            let tr = <HTMLTableRowElement>acc.parentElement!.parentElement
            if (tr)
                this.onExecute(tr)
        }
    }

    close() {
        this.clearSelection()
        this.subMenu.removeEventListener("focusout", this.onFocusOut)
    }

    private initializeMouseHandler() {
        this.subMenu.onmousedown = evt =>  {
            var tr = <HTMLTableRowElement>(<HTMLElement>evt.target).closest("tr")
            this.onExecute(tr)
        }
    }

    private onExecute(tr: HTMLTableRowElement) {
    //     switch (tr.id)
    //     {
    //         case "menuRename":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.executeRename(false)
    //             break;
    //         case "menuCopy":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.executeCopy()
    //             break;
    //         case "menuMove":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.executeMove()
    //             break;
    //         case "menuDelete":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.executeDelete()
    //             break;
    //         case "menuProperties":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.executeShowProperties()
    //             break;
    //         case "menuExit":
    //             close()
    //             break;
    //         case "menuFirst":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.gotoFirst()                    
    //             break;
    //         case "menuFavorites":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.showFavorites()
    //             break;
    //         case "menuSelectAll":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.selectAll()
    //             break;
    //         case "menuSelectNone":
    //             var focused = commanderInstance.getFocused()
    //             if (!focused)
    //                 return
    //             focused.selectNone()
    //             break;
    //         case "menuShowHidden":
    //             commanderInstance.showHidden(localStorage["showHidden"] != "true")
    //             break;
    //         case "menuDarkTheme":
    //             commanderInstance.darkTheme(localStorage["darkTheme"] != "true")
    //             break;
    //         default:
    //             return;
    //     }
    //     this.close()
    //     this.closeMenu()
    }

    private onFocusOut = (evt: Event) => {
        if (!this.subMenu.contains((<any>evt).relatedTarget)) {
            this.close()
            this.closeMenu()
        }
    }

    private clearSelection() {
        Array.from(this.subMenu.querySelectorAll("tr")).forEach(n => n.classList.remove("selected"))
    }

    private focusTr(tr: HTMLTableRowElement) {
        tr.classList.add("selected")
        tr.focus()
    }
}

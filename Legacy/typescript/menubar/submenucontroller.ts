export interface SubMenuController {
    onKeyDown: ()=>void,
    onKeyUp: ()=>void,
    onEnter: ()=>void,
    onKey: (key: string)=>void,
    close: ()=>void
}
export function createSubMenuController(subMenu: HTMLTableElement, actions: Map<string, 
    ()=>void>, keyboardActivated: boolean, closeMenu: () => void) {
    if (keyboardActivated) {
        subMenu.classList.add("keyboardActivated")
        const tr = subMenu.querySelector("tr")!
        focusTr(tr)
    }
    subMenu.addEventListener("focusout", onFocusOut)
    initializeMouseHandler()

    function onKeyDown() {
        let tr = <HTMLTableRowElement>subMenu.querySelector("tr.selected")
        const trs = <HTMLTableRowElement[]>Array.from(subMenu.querySelectorAll("tr.selectable"))
        var i = (trs).findIndex(n => n == tr)
        tr = trs[i + 1]
        if (!tr)
            tr = trs[0]
        clearSelection()
        focusTr(tr)
    }

    function onKeyUp() {
        let tr = <HTMLTableRowElement>subMenu.querySelector("tr.selected")
        const trs = <HTMLTableRowElement[]>Array.from(subMenu.querySelectorAll("tr.selectable"))
        const i = (trs).findIndex(n => n == tr)
        tr = trs[i - 1]
        if (!tr)
            tr = trs[trs.length - 1]
        clearSelection()
        focusTr(tr)
    }

    function onEnter() {
        const tr = <HTMLTableRowElement>subMenu.querySelector("tr.selected")
        if (tr)
            onExecute(tr)
    }

    function onKey(key: string) {
        let accs = <HTMLSpanElement[]>Array.from(subMenu.querySelectorAll(".accelerator"))
        let acc = accs.find(n => n.innerText.toLowerCase() == key)
        if (acc) {
            const tr = <HTMLTableRowElement>acc.parentElement!.parentElement
            if (tr)
                onExecute(tr)
        }
    }

    function close() {
        clearSelection()
        subMenu.removeEventListener("focusout", onFocusOut)
    }

    function initializeMouseHandler() {
        subMenu.onmouseup = evt =>  {
            const tr = <HTMLTableRowElement>(<HTMLElement>evt.target).closest("tr")
            onExecute(tr)
        }
    }

    function onExecute(tr: HTMLTableRowElement) {
        const id = tr.dataset["id"]
        close()
        closeMenu()
        setTimeout(() => {
            if (id) 
                actions.get(id)!()
        }, 0)
    }

    function onFocusOut(evt: Event) {
        if (!subMenu.contains((<any>evt).relatedTarget)) {
            close()
            closeMenu()
        }
    }

    function clearSelection() {
        Array.from(subMenu.querySelectorAll("tr")).forEach(n => n.classList.remove("selected"))
    }

    function focusTr(tr: HTMLTableRowElement) {
        tr.classList.add("selected")
        tr.focus()
    }

    return {
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        onEnter: onEnter,
        onKey: onKey,
        close: close
    }
}


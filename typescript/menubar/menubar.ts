import { Menu, Shortcut, ShortCutAction } from "./menu.js"
import { SubMenuController } from "./submenucontroller.js"
import { getFocused } from "../commander.js"
export { Menu, MenuItemType } from "./menu.js"

const menuElement = document.getElementById("header")!
menuElement.classList.add("menuParent")
const menubarContainer = document.createElement("ul")
menubarContainer.classList.add("menubar")
menuElement.appendChild(menubarContainer)

let latestTabIndex = 0
let subMenuOpened = false
let isActive = false
let hasFocus = false
let keyboardActivated = false
let acceleratorInitiated = false
let openedSubMenu: SubMenuController | undefined
let actions = new Map<string, ()=>void>()
let shortcuts: Shortcut[] = []
let focusedView: any

menuElement.addEventListener("focusout", evt => {
    if (!(subMenuOpened && keyboardActivated) && !menuElement.contains((<any>evt).relatedTarget))
        close()
})

initializeMouseHandler()
initializeKeyHandler()

export function insertItem(item: string) {
    const li = document.createElement("li")
    li.tabIndex = ++latestTabIndex
    li.dataset["id"] = menubarContainer.childElementCount.toString()
    menubarContainer.appendChild(li)
    insertAcceleratableItem(li, item, false)
    return new Menu(menuElement, actions, shortcuts)
}

export function insertAcceleratableItem(element: HTMLElement, item: string, isCheckable: boolean) {
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

function initializeMouseHandler() {
    menubarContainer.onmousedown = evt => {
        const li = <HTMLLIElement>(<HTMLElement>evt.target).closest("li")
        let selected = false
        if (li.classList.contains("selected"))
            selected = true

        if (!isActive)
            setActive()

        subMenuOpened = true

        clearSelection()
        if (!selected)
            focusLi(li)
        else {
            close()
            evt.stopPropagation()
            evt.preventDefault()
        }
    }
}

function initializeKeyHandler() {
    document.addEventListener("keydown", evt => {
        if (!isActive && evt.which == 18) { // Alt
            menuElement.classList.add("keyboardActivated")
            keyboardActivated = true
        }

        if (keyboardActivated && evt.which != 18) { // Alt

            if (openedSubMenu)
                openedSubMenu.onKey(evt.key)
            else {
                const accs = <HTMLSpanElement[]>Array.from(menuElement.querySelectorAll(".keyboardActivated .accelerator"))
                const acc = accs.find(n => n.innerText.toLowerCase() == evt.key)
                if (acc) {
                    if (!isActive)
                        acceleratorInitiated = true
                    const element = acc.parentElement
                    if (element && element.nodeName == "LI") {
                        const li = element as HTMLLIElement
                        setActive()
                        setSubMenuOpened()
                        clearSelection()
                        focusLi(li)
                        evt.stopPropagation()
                        evt.preventDefault()
                        return
                    }
                }
                else if(!isActive)
                    close()
            }
        }
        
        if (!isActive) {
            if (processShortcuts(evt)) {
                evt.stopPropagation()
                evt.preventDefault()
            }
            return
        }

        switch (evt.which) {
            case 9: // TAB
                close()
                break
            case 13: // Enter
                if (openedSubMenu)
                    openedSubMenu.onEnter()
                else if ((<HTMLElement>evt.target).nodeName == "LI") {
                    keyboardActivated = true
                    setSubMenuOpened()
                    const li = <HTMLLIElement>menuElement.querySelector(".menubar>li.selected")
                    focusLi(li)
                }
                break;
            case 18: // alt
                break
            case 27: // ESC
                close()
                break
            case 37: {// <-
                    if (openedSubMenu) {
                        openedSubMenu.close()
                        openedSubMenu = undefined
                    }
                    let li = <HTMLLIElement>menuElement.querySelector(".menubar>li.selected")
                    const lis = <HTMLLIElement[]>Array.from(menuElement.querySelectorAll(".menubar>li"))
                    const i = (lis).findIndex(n => n == li)
                    li = lis[i-1]
                    if (!li)
                        li = lis[lis.length - 1]
                    clearSelection()
                    focusLi(li)
                }
                break
            case 38: //  |^
                if (openedSubMenu)
                    openedSubMenu.onKeyUp()
                break;
            case 39: { // ->
                    if (openedSubMenu) {
                        openedSubMenu.close()
                        openedSubMenu = undefined
                    }
                    let li = <HTMLLIElement>menuElement.querySelector(".menubar>li.selected + li")
                    if (!li)
                        li = <HTMLLIElement>menuElement.querySelector(".menubar>li")
                    clearSelection()
                    focusLi(li)
                }
                break;
            case 40: //  |d
                {
                    if ((<HTMLElement>evt.target).nodeName == "LI") {
                        keyboardActivated = true
                        setSubMenuOpened()
                        const li = <HTMLLIElement>menuElement.querySelector(".menubar>li.selected")
                        focusLi(li)
                    }
                    else if (openedSubMenu)
                        openedSubMenu.onKeyDown()
                }
                break;
            default:
                if (openedSubMenu)
                    openedSubMenu.onKey(evt.key)
                break
        }
        evt.stopPropagation()
        evt.preventDefault()
    }, true)

    document.onkeyup = evt => {
        switch (evt.which) {
            case 18: // alt
                if (!hasFocus && keyboardActivated) {
                    clearSelection()
                    setActive()
                    const li = <HTMLLIElement>menuElement.querySelector(".menubar>li:first-Child")
                    focusLi(li)
                }
                else if (acceleratorInitiated)
                    acceleratorInitiated = false
                else
                    close()
                break
        }
    }        
}

function processShortcuts(evt: KeyboardEvent) {
    const shortcut = shortcuts.find(n => n.key == evt.which && n.alt == evt.altKey && n.ctrl == evt.ctrlKey && n.shift == evt.shiftKey)
    if (shortcut) {
        const actionItem = shortcut as ShortCutAction
        actionItem.callAction!()
        return true
    }
    return false
}
    
function setActive() {
    focusedView = getFocused()
    const lis = <HTMLLIElement[]>Array.from(menubarContainer.querySelectorAll(".menubar>li"))
    lis.forEach(n => {
        n.onmouseover = evt => {
            if (keyboardActivated) {
                close()

                const li = <HTMLLIElement>(<HTMLElement>evt.target).closest("li")
                const selected = (li.classList.contains("selected"))

                if (!isActive)
                    setActive()

                subMenuOpened = true

                clearSelection()
                if (!selected)
                    focusLi(li)
                else
                    close()
                return
            }
                
            clearSelection()
            focusLi(<HTMLLIElement>evt.currentTarget)
        }
    })
    hasFocus = true
}
    
function focusLi(li: HTMLLIElement) {
    li.classList.add("selected")
    li.focus()
    isActive = true

    if (!subMenuOpened)
        return
    closeSubMenus()

    const index = Number.parseInt(li.dataset["id"]!)
    openSubMenu(li.offsetLeft, li.offsetHeight, index, keyboardActivated)
}

function openSubMenu(offsetLeft: number, offsetTop: number, index: number, keyboardActivated: boolean) {
    let table = menuElement.children[index + 1]as HTMLTableElement
    table.style.left = `${offsetLeft}px`
    table.style.top = `${offsetTop}px`
    table.classList.remove("hidden")
    if (subMenuOpened) {
        if (openedSubMenu)
            openedSubMenu.close()
        openedSubMenu = new SubMenuController(table, actions, keyboardActivated, () => close())
    }
}

function setSubMenuOpened() {
    menubarContainer.classList.add("subMenuOpened")
    subMenuOpened = true
}

function setSubMenuClosed() {
    menubarContainer.classList.remove("subMenuOpened")
    subMenuOpened = false
}
    
function closeSubMenus() {
    const subs = Array.from(document.getElementsByClassName("submenu"))
    subs.forEach(n => n.classList.add("hidden"))
}

function clearSelection() {
    Array.from(menubarContainer.querySelectorAll(".menubar>li")).forEach(n => n.classList.remove("selected"))
}

function close() {
    closeSubMenus()
    menuElement.classList.remove("keyboardActivated")
    keyboardActivated = false;
    clearSelection()
    hasFocus = false
    isActive = false
    acceleratorInitiated = false
    setSubMenuClosed()
    if (openedSubMenu)
        openedSubMenu.close()
    openedSubMenu = undefined
    const lis = <HTMLLIElement[]>Array.from(menubarContainer.querySelectorAll(".menubar>li"))
    lis.forEach(n => (n.onmouseover as any) = null)
    setTimeout(() => focusedView.focus(), 100)
}

 
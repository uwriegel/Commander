﻿// TODO: Weiterentwicklung
// Siehe main.fs

// Extension in Webserver
// GetRootItems Windows

// Entweder im DirectoryPresenter
// getIconURl als c/gtk-Dll über Webserver/c# abrufbar
// oder 
// GetDriveItems as c++

// Unterscheidung Selektion und Tastaturselektion im Menü

// Sortierung bei Spalte Version berücksichtigen
// Css-Definitions, Theme
// Icon 
// mount not mounted devices
//
// Start as Admin im Hintergrund
// drives: Gespeicherte Ansichten
// RegistryItems anzeigen
// NachRefresh Selektion erhalten
// Conflicts: conflict liste in die Focusable anhängen
// Rename auch von mehreren Dateien
import { createGrid }  from './grid.js'
import { createVerticalGrid }  from './vgrid.js'
import { CommanderView, createCommanderView }  from './commanderview.js'
import { MenuItemType, insertItem as insertMenuItem }  from './menubar/menubar.js'
import { MenuItemSelector } from './menubar/menuitemcontrol.js'
import { setShowHidden } from './global-settings.js'
import { joinPath } from './filehelper.js'
import { createViewer }  from './viewer.js'
import { Item } from './item.js'

const leftView = createCommanderView("leftView")
const rightView = createCommanderView("rightView")
const footer = document.getElementById("footer")
const viewer = createViewer()

export function getFocused() {
    return focusedView
}

setTheme(localStorage["theme"] || "blue")
initializeMenubar()
leftView.setOtherView(rightView)
rightView.setOtherView(leftView)
leftView.setOnCurrentItemChanged(currentItemChanged)
rightView.setOnCurrentItemChanged(currentItemChanged)

focusedView = leftView
leftView.setOnFocus(() => focusedView = leftView)
rightView.setOnFocus(() =>focusedView = rightView)
leftView.focus()

const gridElement = document.getElementById("grid") as HTMLDivElement
const viewerElement = document.getElementById("viewer")!
createGrid(gridElement, document.getElementById("leftView")!, document.getElementById("rightView")!, 
    document.getElementById("grip") as HTMLDivElement, focusedView.focus)

createVerticalGrid(document.getElementById("vgrid") as HTMLDivElement, gridElement, viewerElement!,
    document.getElementById("vgrip") as HTMLDivElement, focusedView.focus)

viewerElement.onclick = focusedView.focus

initializeOnKeyDownHandler()

window.addEventListener('close', _ => alert("exit()"))


// getCommanderView(id: string) {
//     switch (id)
//     {
//         case "leftView":
//             return this.leftView
//         case "rightView":
//             return this.rightView
//         default:
//             return undefined
//     }
// }

function initializeOnKeyDownHandler() {
    document.onkeydown = evt => {
        switch (evt.which) {
            case 9: // TAB
                if (!evt.shiftKey) {
                    if (focusedView.isDirectoryInputFocused())
                        focusedView.focus()
                    else {
                        const toFocus = focusedView == leftView ? rightView : leftView
                        toFocus.focus()
                    }
                }
                else
                    focusedView.focusDirectoryInput()
                break
            default:
                return
        }
        evt.preventDefault()
    }
}

function showHidden(show: boolean) {
    setShowHidden(show)
    leftView.refresh()
    rightView.refresh()
}

function currentItemChanged(item: Item, path: string) {
    if (item) {
        const text = joinPath(path, item.displayName)
        footer!.textContent = text
        viewer.selectionChanged(text)
    }
    else {
        footer!.textContent = "Nichts selektiert"
        viewer.selectionChanged("")
    }
}

function setTheme(theme: string) {
    localStorage["theme"] = theme

    let styleSheet = document.getElementById("dark")
    if (styleSheet)
        styleSheet.remove()
    styleSheet = document.getElementById("blue")
    if (styleSheet)
        styleSheet.remove()
    styleSheet = document.getElementById("lightblue")
    if (styleSheet)
        styleSheet.remove()

    const head = document.getElementsByTagName('head')[0]
    let link = document.createElement('link')
    link.rel = 'stylesheet'
    link.id = 'theme'
    link.type = 'text/css'
    link.href = `assets/css/themes/${theme}.css`
    link.media = 'all'
    head.appendChild(link)
}

function initializeMenubar() {
    const menuFile = insertMenuItem("_Datei")
    const menuNavigation = insertMenuItem("_Navigation")
    const menuSelection = insertMenuItem("_Selektion")
    const menuView = insertMenuItem("_Ansicht")
    menuFile.appendItem({
        name: "_Umbenennen",
        shortcut: {
            display: "F2",
            key: 113
        }
    })
    menuFile.appendItem({
        type: MenuItemType.Separator
    })
    menuFile.appendItem({
        name: "_Kopieren",
        shortcut: {
            display: "F5",
            key: 116
        },
        action: () => alert("Kopie")
    })
    menuFile.appendItem({
        name: "_Verschieben",
        shortcut: {
            display: "F6",
            key: 117
        },
        action: () => alert("Verschiebe")
    })
    menuFile.appendItem({
        name: "_Löschen",
        shortcut: {
            display: "F8",
            key: 119
        }
    })
    menuFile.appendItem({
        type: MenuItemType.Separator
    })
    menuFile.appendItem({
        name: "_Eigenschaften",
        shortcut: {
            display: "Alt+Enter",
            key: 13,
            alt: true
        }
    })
    menuFile.appendItem({
        type: MenuItemType.Separator
    })
    menuFile.appendItem({
        name: "_Beenden",
        shortcut: {
            display: "Alt+F4",
            key: 115,
            alt: true
        },
        action: () => window.close()
    })

    menuNavigation.appendItem({
        name: "_Erstes Element",
        shortcut: {
            display: "Pos1",
            key: 36
        }
    })
    menuNavigation.appendItem({
        name: "_Favoriten",
        shortcut: {
            display: "F1",
            key: 112
        }
    })

    menuSelection.appendItem({
        name: "_Alles",
        shortcut: {
            display: "Num+",
            key: 107
        }
    })
    menuSelection.appendItem({
        name: "_Nichts",
        shortcut: {
            display: "Num-",
            key: 109
        }
    })
    menuView.appendItem({
        name: "_Versteckte Dateien",
        shortcut: {
            display: "Strg+H",
            key: 72,
            ctrl: true
        },
        type: MenuItemType.Checkable,
        action: m => showHidden(m.isSelected())
    })
    menuView.appendItem({
        type: MenuItemType.Separator
    })

    const changeTheme = (menuItemSelector: MenuItemSelector) => {
        menuLightBlue.setSelection(false)
        menuBlue.setSelection(false)
        menuDark.setSelection(false)
        menuItemSelector.setSelection(true)
        if (menuItemSelector == menuLightBlue)
            setTheme("lightblue")
        else if (menuItemSelector == menuBlue)
            setTheme("blue")
        else if (menuItemSelector == menuDark)
            setTheme("dark")
    }

    var menuLightBlue = menuView.appendItem({
        name: "_Hellblaues Schema",
        type: MenuItemType.Checkable,
        action: m => changeTheme(m)
    })
    var menuBlue = menuView.appendItem({
        name: "B_laues Schema",
        type: MenuItemType.Checkable,
        action: m => changeTheme(m)
    })
    var menuDark = menuView.appendItem({
        name: "_Dunkles Schema",
        type: MenuItemType.Checkable,
        action: m => changeTheme(m)
    })

    const selectedTheme = localStorage["theme"] || "blue"
    switch (selectedTheme) {
        case "blue":
            menuBlue.setSelection(true)
            break;
        case "lightblue":
            menuLightBlue.setSelection(true)
            break;
        case "dark":
            menuDark.setSelection(true)
            break;
    }

    menuView.appendItem({
        type: MenuItemType.Separator
    })
    menuView.appendItem({
        name: "Voll_bild",
        shortcut: {
            display: "F11",
            key: 122
        },
        type: MenuItemType.Checkable,
        action: _ => {
        }
    })
}
    
var focusedView: CommanderView




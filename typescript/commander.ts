// TODO: Weiterentwicklung
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
import { Grid }  from './grid.js'
import { VerticalGrid }  from './vgrid.js'
import { CommanderView }  from './commanderview.js'
import { Menubar, MenuItemType }  from './menubar/menubar.js'
import { MenuItemControl } from './menubar/menuitemcontrol.js'
import { setShowHidden } from './global-settings.js'
import { platform, Platform } from './platform.js'
import { joinPath } from './filehelper.js'

import { Viewer }  from './viewer.js'
import { Item } from './model/item.js'


//               Presenter (Steuert die Daten, passt die Views an, sorgt für die Sortierung und Ansichtsfilterung)
//                  /\
//                 /  \
//                /    \
//             Model  View (TableView, ColumnsControl)

const leftView = new CommanderView("leftView")
const rightView = new CommanderView("rightView")
const footer = document.getElementById("footer")
const viewer = new Viewer()
const menubar = new Menubar("header")

export function getFocused() {
    return focusedView
}

(function () {
    setTheme("blue")
    initializeMenubar()
    leftView.otherView = rightView
    rightView.otherView = leftView
    leftView.setOnCurrentItemChanged(currentItemChanged)
    rightView.setOnCurrentItemChanged(currentItemChanged)

    focusedView = leftView
    leftView.setOnFocus(() => focusedView = leftView)
    rightView.setOnFocus(() =>focusedView = rightView)
    leftView.focus()

    const gridElement = document.getElementById("grid") as HTMLDivElement
    const viewerElement = document.getElementById("viewer")!
    new Grid(gridElement, document.getElementById("leftView")!, document.getElementById("rightView")!, 
        document.getElementById("grip") as HTMLDivElement, focusedView.focus)
    
    new VerticalGrid(document.getElementById("vgrid") as HTMLDivElement, gridElement, viewerElement!,
        document.getElementById("vgrip") as HTMLDivElement, focusedView.focus)

    viewerElement.onclick = focusedView.focus

    initializeOnKeyDownHandler()

    window.addEventListener('close', _ => alert("exit()"))
})()

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

    if (platform == Platform.Linux) {
        link = document.createElement('link')
        link.rel = 'stylesheet'
        link.id = 'theme'
        link.type = 'text/css'
        link.href = `assets/css/themes/ubuntu.css`
        link.media = 'all'
        head.appendChild(link)
    }
}

function initializeMenubar() {
    const menuFile = menubar.insertItem("_Datei")
    const menuNavigation = menubar.insertItem("_Navigation")
    const menuSelection = menubar.insertItem("_Selektion")
    const menuView = menubar.insertItem("_Ansicht")
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
        action: () => {
            var gui = require("nw.gui")
            const mainWindow = gui.Window.get()
            mainWindow.close()
        }
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
        action: m => showHidden(m.isChecked)
    })
    menuView.appendItem({
        type: MenuItemType.Separator
    })

    const changeTheme = (menuItemControl: MenuItemControl) => {
        menuLightBlue.isChecked = false
        menuBlue.isChecked = false
        menuDark.isChecked = false
        menuItemControl.isChecked = true
        if (menuItemControl == menuLightBlue)
            setTheme("lightblue")
        else if (menuItemControl == menuBlue)
            setTheme("blue")
        else if (menuItemControl == menuDark)
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
    menuBlue.isChecked = true
    var menuDark = menuView.appendItem({
        name: "_Dunkles Schema",
        type: MenuItemType.Checkable,
        action: m => changeTheme(m)
    })
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
        action: menu => {
            var gui = require("nw.gui")
            const mainWindow = gui.Window.get()
            menu.isChecked ? mainWindow.enterFullscreen() : mainWindow.leaveFullscreen()
        }
    })
}
    
var focusedView: CommanderView




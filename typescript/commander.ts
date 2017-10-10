// TODO: Weiterentwicklung

// Css-Definitions, Theme
// Sortierung
// Version (on windows)
// Icon 
// mount not mounted devices
//
// Start as Admin im Hintergrund
// drives: Gespeicherte Ansichten
// RegistryItems anzeigen
// NachRefresh Selektion erhalten
// Conflicts: conflict liste in die Focusable anhängen
// Rename auch von mehreren Dateien
import * as Path from 'path'
import { ipcRenderer }  from 'electron'
import { GlobalSettings } from './global-settings'
import { Grid }  from './grid'
import { VerticalGrid }  from './vgrid'
import { CommanderView }  from './commanderview'
import { Viewer }  from './viewer'
import { Item } from './model/item'
/*

              Presenter (Steuert die Daten, passt die Views an, sorgt für die Sortierung und Ansichtsfilterung)
                 /\
                /  \
               /    \
            Model  View (TableView, ColumnsControl)

        Der Presenter kann einen Sorter hinzugefügt bekommen

        Presenter 
*/

class Commander {
    get focused() {
        return this.focusedView
    }

    constructor() {
        this.leftView.otherView = this.rightView
        this.rightView.otherView = this.leftView
        this.leftView.setOnCurrentItemChanged((item: Item, path: string) => this.currentItemChanged(item, path))
        this.rightView.setOnCurrentItemChanged(this.currentItemChanged.bind(this))

        this.focusedView = this.leftView
        this.leftView.setOnFocus(() => this.focusedView = this.leftView)
        this.rightView.setOnFocus(() =>this.focusedView = this.rightView)
        this.leftView.focus()

        const gridElement = <HTMLDivElement>document.getElementById("grid")
        const viewerElement = document.getElementById("viewer")!
        new Grid(gridElement, document.getElementById("leftView")!, document.getElementById("rightView")!, 
             <HTMLDivElement>document.getElementById("grip"), () => this.focusedView.focus())
            
        const vgrid = new VerticalGrid(<HTMLDivElement>document.getElementById("vgrid"), gridElement, viewerElement!,
             <HTMLDivElement>document.getElementById("vgrip"), () => this.focusedView.focus())

        viewerElement.onclick = () =>this.focusedView.focus()

        this.initializeOnKeyDownHandler();

        ipcRenderer.on("showHidden", (_: any, showHidden: boolean) => this.showHidden(showHidden))
        ipcRenderer.on("darkTheme", (_: any, dark: boolean) => this.setDarkTheme(dark))
        ipcRenderer.on("preview", (_: any, preview: boolean) => vgrid.switchBottom(preview))
    }

    getCommanderView(id: string) {
        switch (id)
        {
            case "leftView":
                return this.leftView
            case "rightView":
                return this.rightView
            default:
                return undefined
        }
    }

    private initializeOnKeyDownHandler() {
        document.onkeydown = evt => {
            switch (evt.which) {
                case 9: // TAB
                    if (!evt.shiftKey) {
                        if (this.focusedView.isDirectoryInputFocused())
                           this.focusedView.focus()
                        else {
                            const toFocus = this.focusedView == this.leftView ? this.rightView : this.leftView
                            toFocus.focus()
                        }
                    }
                    else
                        this.focusedView.focusDirectoryInput()
                    break
                default:
                    return
            }
            evt.preventDefault()
        }
    }

    showHidden(show: boolean) {
        GlobalSettings.showHidden = show
        this.leftView.refresh()
        this.rightView.refresh()
    }

    setDarkTheme(activate: boolean) {
        if (activate) {
            const head = document.getElementsByTagName('head')[0]
            let link = document.createElement('link')
            link.rel = 'stylesheet'
            link.id = 'darkThemeStylesheet'
            link.type = 'text/css'
            link.href = 'styles/dark.css'
            link.media = 'all'
            head.appendChild(link)
        } else {
            const styleSheet = document.getElementById("darkThemeStylesheet")
            styleSheet!.remove()
        }
    }

    private currentItemChanged(item: Item, path: string) {
        if (item) {
            const text = Path.join(path, item.displayName)
            this.footer!.textContent = text
            this.viewer.selectionChanged(text)
        }
        else {
            this.footer!.textContent = "Nichts selektiert"
            this.viewer.selectionChanged("")
        }
    }

    private readonly leftView = new CommanderView("leftView")
    private readonly rightView = new CommanderView("rightView")
    private readonly footer = document.getElementById("footer")
    private readonly viewer = new Viewer()
    
    private focusedView: CommanderView
}

new Commander()


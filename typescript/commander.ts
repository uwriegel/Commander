// TODO: Weiterentwicklung
//
// Start as Admin im Hintergrund
// drives: Gespeicherte Ansichten
// RegistryItems anzeigen
// NachRefresh Selektion erhalten
// Conflicts: conflict liste in die Focusable anhängen
// Rename auch von mehreren Dateien
import { ipcRenderer }  from 'electron'
import { Grid }  from './grid'
import { VerticalGrid }  from './vgrid'
import { CommanderView }  from './commanderview'
import { Viewer }  from './viewer'
import { Item }  from './itemsmodel'

/*

              Presenter (Steuert die Daten, passt die Views an)
                 /\
                /  \
               /    \
            Model  View (TableView, ColumnsControl)

        Der Presenter kann einen Sorter hinzugefügt bekommen

        Presenter 
*/

class Commander
{
    constructor()
    {
        this.leftView.otherView = this.rightView
        this.rightView.otherView = this.leftView
        //this.leftView.setOnCurrentItemChanged(this.currentItemChanged.bind(this))
        //this.rightView.setOnCurrentItemChanged(this.currentItemChanged.bind(this))

        this.focusedView = this.leftView
        //this.leftView.setOnFocus(() => this.focusedView = this.leftView)
        //this.rightView.setOnFocus(() =>this.focusedView = this.rightView)

        // this.leftView.initialize()
        // this.rightView.initialize()
        this.leftView.focus()

        const gridElement = <HTMLDivElement>document.getElementById("grid")
        const viewerElement = document.getElementById("viewer")!
        const grid = new Grid(gridElement, document.getElementById("leftView")!, document.getElementById("rightView")!, 
             <HTMLDivElement>document.getElementById("grip"), () => this.focusedView.focus())
            
        const vgrid = new VerticalGrid(<HTMLDivElement>document.getElementById("vgrid"), gridElement, viewerElement!,
             <HTMLDivElement>document.getElementById("vgrip"), () => this.focusedView.focus())

        viewerElement.onclick = () =>this.focusedView.focus()

        this.initializeOnKeyDownHandler();

        ipcRenderer.on("darkTheme", (evt: any, dark: boolean) => this.setDarkTheme(dark))
        ipcRenderer.on("preview", (evt: any, preview: boolean) => vgrid.switchBottom(preview))
    }

    getCommanderView(id: string) {
        switch (id)
        {
            case "leftView":
                return this.leftView
            case "rightView":
                return this.rightView
        }
    }

    getFocused() {
            return this.focusedView
    }

    // dragOver(x: number, y: number)
    // {
    //     // if (this.leftView.isMouseInTableView(x, y))
    //     // {
    //     //     // console.log(`Drag: ${x}, ${y}`);
    //     // }
    //     // if (this.rightView.isMouseInTableView(x, y))
    //     // {
    //     //     //console.log(`Drag: ${x}, ${y}`);
    //     // }
    // }

    // dragLeave()
    // {
    //     // this.leftView.dragLeave()
    //     // this.rightView.dragLeave()
    // }

    // drop(x: number, y: number, dragDropKind: DragDropKind, directory: string, items: Item[])
    // {
    //     // if (this.leftView.isMouseInTableView(x, y))
    //     // {
    //     //     this.leftView.dragLeave()
    //     //     this.rightView.drop(dragDropKind, directory, items)
    //     // }
    //     // if (this.rightView.isMouseInTableView(x, y))
    //     // {
    //     //     this.rightView.dragLeave()
    //     //     this.leftView.drop(dragDropKind, directory, items)
    //     // }
    // }

    private initializeOnKeyDownHandler()
    {
        document.onkeydown = evt =>
        {
            switch (evt.which)
            {
                case 9: // TAB
                    if (!evt.shiftKey)
                    {
                        // if (this.focusedView.isDirectoryInputFocused())
                        //     this.focusedView.focus()
                        // else
                        // {
                        //     var toFocus = this.focusedView == this.leftView ? this.rightView : this.leftView
                        //     toFocus.focus()
                        // }
                    }
  //                  else
//                        this.focusedView.focusDirectoryInput()
                    break
                // case 83: // s
                //     if (evt.ctrlKey)
                //     {
                //         SavedViews.save({
                //             left: this.leftView.currentDirectory,
                //             right: this.rightView.currentDirectory
                //         })
                //         break
                //     }
                //     else
                //         return
                // case 112: // F1
                //     if (evt.ctrlKey)
                //     {
                //         this.leftView.changeDirectory("SavedViews")
                //         this.rightView.changeDirectory("SavedViews")
                //     }
                //     break
                // case 116: // F5
                //     break
                // case 121: // F10
                //     break
                default:
                    return
            }
            evt.preventDefault()
        }
    }

    showHidden(show: boolean)
    {
        //FileSystem.showHidden = show
        // this.leftView.refresh()
        // this.rightView.refresh()
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

    private currentItemChanged(item: Item, directory: string)
    {
        if (item)
        {
            var text = directory + '\\' + item.name
            this.footer!.textContent = text
            this.viewer.selectionChanged(text)
        }
        else
        {
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

const commanderInstance = new Commander()

// TODO: 
// document.ondragover = document.ondrop = (ev) => {
//     ev.preventDefault()
//   }
  
//   document.body.ondrop = (ev) => {
//     console.log(ev.dataTransfer.files[0].path)
//     ev.preventDefault()
//   }


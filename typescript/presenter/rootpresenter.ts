import { DirectoryPresenter } from './directory-presenter';
import { PresenterChooser } from './presenter-chooser'
import { PresenterBase }  from './presenterbase'
import { ColumnsControl }  from '../columnscontrol'
import * as driveList from 'drivelist'
import { FileHelper } from '../filehelper' 
import { RootItem } from '../model/root-item'

// TODO: Sortierung
// TODO: Statuszeile 
// TODO: Favoriten, Historie, Windows-spezifische Anpassungen, DVD-Laufwerke
class RootPresenter extends PresenterBase
{
    constructor() {
        super()
    }

    getSelectedPath(index: number) {
        var item = this.getItem(index) as RootItem
        return { selectedPath: item.path, currentPath: "" }
    }

    checkPath(path: string) {
        return path == PresenterChooser.rootSelector
    }

    protected processFill() {
        return new Promise<void>(async resolve => {
            var initialItems = await this.platform.getInitialRootItems()
            var rootItems = await this.getRootItems()

            this.items = initialItems.concat(rootItems)
            this.view.itemsChanged(0)
            resolve()
        })
    }

    protected setColumns() {
        this.view.setColumns(new ColumnsControl([
            {
                item: "Name",
                class: "nein"
            },
            {
                item: "Beschreibung",
                class: "nein"
            },
            {
                item: "Größe",
                class: "nein"
            },
            
        ], "4"))
    }

    protected createItem(item?: RootItem) : HTMLTableRowElement
    {
        const tr = document.createElement("tr")

        if (item && !item.path)
            tr.classList.add("hidden")
    
        let td = PresenterBase.itemIconNameTemplate.cloneNode(true) as HTMLTableDataCellElement
        let img = td.querySelector('img') as HTMLImageElement
        img.src = "images/drive.png"
        let span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.displayName : 'W'
        tr.appendChild(td)
        
        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.description : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemRightTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? FileHelper.formatFileSize(item.size) : 'W'
        tr.appendChild(td)
        
        tr.appendChild(td)
        tr.tabIndex = 1
        return tr
    }

    private getRootItems() {
        
        return new Promise<RootItem[]>((resolve, reject) => 
        driveList.list((error: any, drives: DriveItem[]) => {
                if (error) 
                    reject(error)
                drives = drives.sort((a, b) => a.displayName.localeCompare(b.displayName))
                const rootItems = drives.map(n => { return {
                    description: n.description,
                    displayName: n.displayName,
                    isDirectory: true,
                    size: n.size,
                    path: n.mountpoints.length > 0 ? (n.mountpoints[0].path.endsWith(':') ? n.mountpoints[0].path + '\\' : n.mountpoints[0].path) : ""
                }})
                resolve(rootItems)
            })
        )
    }
}

export { RootPresenter }
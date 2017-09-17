import { PresenterBase }  from './presenterbase'
import { ColumnsControl }  from '../columnscontrol'
import * as driveList from 'drivelist'
import { FileHelper } from '../filehelper' 
import { Platform, getPlatform }from '../platform/platform-creator' 

export interface RootItem
{
    displayName: string
    description: string
    size: number
}

// TODO: Sortierung
// TODO: Statuszeile 
// TODO: Favoriten, Historie, Windows-spezifische Anpassungen, DVD-Laufwerke
class RootPresenter extends PresenterBase
{
    constructor()
    {
        super()

        this.platform = getPlatform()

        this.itemIconNameTemplate = (document.getElementById('tableDataItemIconNameTemplate') as HTMLTemplateElement).content.querySelector('td')!
        this.itemTemplate = (document.getElementById('tableDataItemTemplate') as HTMLTemplateElement).content.querySelector('td')!
        this.itemRightTemplate = (document.getElementById('tableDataItemRightTemplate') as HTMLTemplateElement).content.querySelector('td')!
    }

    fill(path: string) {
        return new Promise<void>(async (resolve, reject) => {
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

        let td = this.itemIconNameTemplate.cloneNode(true) as HTMLTableDataCellElement
        let img = td.querySelector('img') as HTMLImageElement
        img.src = "images/drive.png"
        let span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.displayName : 'W'
        tr.appendChild(td)
        
        td = this.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        td = this.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.description : 'W'
        tr.appendChild(td)

        td = this.itemRightTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? FileHelper.formatFileSize(item.size) : 'W'
        tr.appendChild(td)
        
        tr.appendChild(td)
        tr.tabIndex = 1
        return tr
    }

    private getRootItems() {
        return new Promise<RootItem[]>((resolve, reject) => 
            driveList.list((error: any, drives: RootItem[]) => {
                if (error) 
                    reject(error)
                resolve(drives)
            })
        )
    }

    private readonly platform: Platform
    private readonly itemIconNameTemplate: HTMLTableDataCellElement
    private readonly itemTemplate: HTMLTableDataCellElement
    private readonly itemRightTemplate: HTMLTableDataCellElement
}

export { RootPresenter }
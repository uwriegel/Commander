import { PresenterBase }  from './presenterbase.js'
import { PresenterChooser } from './presenter-chooser.js'
import { Item } from '../model/item.js'
import { FileHelper } from '../filehelper.js' 
import { DirectoryItem } from '../model/directory-item.js'
import { GlobalSettings } from '../global-settings.js'
const Path = require('path')

export abstract class DirectoryPresenter extends PresenterBase {

    protected constructor() {
        super()
    }
    
    getSelectedPath(index: number) {
        var item = this.getItem(index) as DirectoryItem
        if (!item.isDirectory)
            return { selectedPath: "", currentPath: "" }
        if ((this.path == '/' || (this.path.length == 3 && this.path[1] == ':')) && item.displayName == "..")
            return { selectedPath: PresenterChooser.rootSelector, currentPath: this.path } 
        return { selectedPath: Path.join(this.path, item.displayName), 
            currentPath: item.displayName == ".." ? this.path : "" }
    }
    
    checkPath(_: string) {
        return false
    }

    isDefault = true

    sort(columnIndex: number, ascending: boolean) {
        this.sortAscending = ascending
        switch (columnIndex) {
            case 0:
                this.sortItem = (a: DirectoryItem, b: DirectoryItem) => a.displayName.localeCompare(b.displayName)                
                break
            case 1:
                this.sortItem = (a: DirectoryItem, b: DirectoryItem) => Path.extname(a.displayName).localeCompare(Path.extname(b.displayName))
                break;
            case 2:
                this.sortItem = (a: DirectoryItem, b: DirectoryItem )=> a.date.getTime() - b.date.getTime()
                break
            case 3:
                this.sortItem = (a: DirectoryItem, b: DirectoryItem )=> a.size - b.size                
                break
        }

        const currentIndex = this.view.getCurrentItemIndex()
        const currentItem = this.items[currentIndex]
        this.items = this.getFolderItems(this.items as DirectoryItem[]).concat(this.getFileItems(this.items as DirectoryItem[]))

        const newCurrentIndex = currentIndex ? 
            (this.items).findIndex((i: DirectoryItem) => i.displayName.localeCompare(currentItem.displayName) == 0)
            : 0
        
        this.view.itemsChanged(newCurrentIndex)
        return true
    }

    protected processFill(selectPath?: string) {
        return new Promise<void>(async (resolve) => {
            const items = await this.getFiles(this.path)
            const folderItems = this.getFolderItems(items)
            const fileItems = this.getFileItems(items)
            this.items = [{
                    displayName: "..",
                    size: -1,
                    isDirectory: true
                }
            ].concat(folderItems).concat(fileItems)

            if (!GlobalSettings.showHidden)
                this.items = this.items.filter(n => !n.isHidden)

            let lastIndex = 0
            if (selectPath) {
                const directoryItems = this.items as DirectoryItem[]
                const dir = Path.basename(selectPath)
                const lastItem = directoryItems.find(n => n.displayName == dir)
                if (lastItem)
                    lastIndex = directoryItems.indexOf(lastItem)
            }

            this.view.itemsChanged(lastIndex)

            resolve()

            this.insertExtendedInfos()
        })
    }

    protected createItem(item?: DirectoryItem | undefined): HTMLTableRowElement {
        const tr = document.createElement("tr")

        if (item && item.isHidden)
            tr.classList.add("hidden")

        const ext = item ? Path.extname(item.displayName) : ""

        let td = PresenterBase.itemIconNameTemplate.cloneNode(true) as HTMLTableDataCellElement
        let img = td.querySelector('img') as HTMLImageElement
        img.src = "" //this.platform.getIconUrl(item!)
        let span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? Path.basename(item.displayName, ext) : 'W'
        tr.appendChild(td)
        
        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? ext : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? FileHelper.formatDate(item.date) : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemRightTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? FileHelper.formatFileSize(item.size) : 'W'
        tr.appendChild(td)
        
        // if (item)
        //     this.extendedUpdateItem(tr, item)

        tr.tabIndex = 1
        if (item && item.isSelected)
            tr.classList.add("selected")
        else
            tr.classList.remove("selected")

        return tr
    }

    protected abstract async getFiles(path: string): Promise<DirectoryItem[]>

    updateItem(itemElement: HTMLTableRowElement, index: number) {
//        const item = this.items[index]
//        this.extendedUpdateItem(itemElement, item)
    }

    protected canBeSelected(itemIndex: number) {
        return itemIndex != 0
    }

    private getFolderItems(items: DirectoryItem[]) {
        return items.filter(a => a.isDirectory).sort((a, b) => a.displayName.localeCompare(b.displayName))
    }

    private getFileItems(items: DirectoryItem[]) {
        return items.filter(a => !a.isDirectory).sort((a, b) => {
            const sort = this.sortItem(a, b)
            return this.sortAscending ? sort : -sort
        })
    }

    private sortItem = (a: DirectoryItem, b: DirectoryItem)=>a.displayName.localeCompare(b.displayName)

    private async insertExtendedInfos() {
        //await this.platform.insertExtendedInfos(this.path, this.items)
        this.view.updateItems()            
    }
}
import * as fs from 'fs'
import * as Path from 'path'
import { PresenterBase, Item }  from './presenterbase'
import { ColumnsControl }  from '../columnscontrol'
import { View }  from '../view'
import { FileHelper } from '../filehelper' 

export interface DirectoryItem extends Item {
    size: number
    date: Date
}

export class DirectoryPresenter extends PresenterBase {
    
    getSelectedPath(index: number) {
        var item = this.getItem(index) as DirectoryItem
        if (!item.isDirectory)
            return { selectedPath: "", currentPath: "" }
        return { selectedPath: Path.join(this.path, item.displayName), 
            currentPath: item.displayName == ".." ? this.path : "" }
    }
    
    checkPath(path: string) {
        return false
    }

    isDefault = true

    protected processFill(selectPath?: string) {
        return new Promise<void>(async (resolve, reject) => {
            const result = (await this.readDir(this.path))
            const items = await Promise.all(result.map(async file => await this.stat(this.path, file)))
            const folderItems = items.filter(a => a.isDirectory).sort((a, b) => a.displayName.localeCompare(b.displayName))
            const fileItems = items.filter(a => !a.isDirectory).sort((a, b) => a.displayName.localeCompare(b.displayName))
            this.items = [{
                    displayName: "..",
                    size: -1,
                    isDirectory: true
                }
            ].concat(folderItems).concat(fileItems)

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
        })
    }

    protected createItem(item?: DirectoryItem | undefined): HTMLTableRowElement {
        const tr = document.createElement("tr")
        
        let td = PresenterBase.itemIconNameTemplate.cloneNode(true) as HTMLTableDataCellElement
        let img = td.querySelector('img') as HTMLImageElement
        img.src = item ? (item.isDirectory ?  "images/folder.png" : "images/fault.png") : "images/fault.png"
        let span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.displayName : 'W'
        tr.appendChild(td)
        
        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? FileHelper.formatDate(item.date) : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemRightTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? FileHelper.formatFileSize(item.size) : 'W'
        tr.appendChild(td)
        
        tr.appendChild(td)
        tr.tabIndex = 1
        return tr
    }

    protected setColumns(): void {
        this.view.setColumns(new ColumnsControl([
            {
                item: "Name",
                class: "nein"
            },
            {
                item: "Datum",
                class: "nein"
            },
            {
                item: "Größe",
                class: "nein"
            },
            {
                item: "",
                class: "nein"
            },
            
        ], "6"))
    }

    private async readDir(path: string)
    {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err)
                    reject(err)
                else
                    resolve(files)
            })
        })
    }

    private async stat(path: string, fileName: string)
    {
        const file = Path.join(path, fileName)
        return new Promise<DirectoryItem>((resolve, reject) => {
            fs.stat(file, (err, stats) => {
                if (err)
                    reject(err)
                else {
                    resolve({
                        displayName: fileName,
                        size: stats.size,
                        date: stats.ctime,
                        isDirectory: stats.isDirectory()                                              
                    })
                }
            })
        })
    }
}
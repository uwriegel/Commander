import { RootPresenter as RootPresenterBase, PresenterBase, RootItem } from '../../rootpresenter.js'
import { ColumnsControl } from '../../../columnscontrol.js'
import { formatFileSize } from '../../../filehelper.js'

export interface LinuxRootItem extends RootItem {
    type: string
}

export class RootPresenter extends RootPresenterBase {

    constructor() {
        super()
    }

    protected setColumns() {
        this.view.setColumns(new ColumnsControl(["Name", "Typ", "Beschreibung", "Mount", "Größe"], "4"))
    }

    protected processFill(selectedPath?: string) {
        return new Promise<void>(async resolve => {

            const initialItems = [ {
                displayName: 'Home',
                description: "Persönlicher Ordner",
                size: -1,
                type: "",
                path: process.env.HOME!,
                isDirectory: true
            }]

            var rootItems = await this.getItems()

            this.items = initialItems.concat(rootItems)
            this.itemsChanged(selectedPath)

            resolve()
        })
    }

    protected createItem(item?: RootItem) : HTMLTableRowElement {
        const tr = document.createElement("tr")
        
        const linuxRootItem = item as LinuxRootItem
        if (item && !item.path)
            tr.classList.add("it-hidden")
    
        let td = PresenterBase.itemIconNameTemplate.cloneNode(true) as HTMLTableDataCellElement
        let img = td.querySelector('img') as HTMLImageElement
        img.src = "assets/images/drive.png"
        let span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.displayName : 'W'
        tr.appendChild(td)
        
        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = linuxRootItem ? linuxRootItem.type : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.description : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.path : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemRightTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? formatFileSize(item.size) : 'W'
        tr.appendChild(td)
        
        tr.tabIndex = 1
        return tr
    }

    async getItems() {
        const childProcess = require("child_process")

        async function getDrives() {
            return new Promise<string>(resolve => {
                let result = ""
                const process = childProcess.spawn('lsblk',["--bytes", "--output", "NAME,FSTYPE,LABEL,MOUNTPOINT,MODEL,SIZE"])
                process.stdout.on('data', (data: Buffer) => {
                    const lines = data.toString('utf8').trim()
                    if (lines != "None") 
                        result += lines
                })
                process.on('close', () => resolve(result));
            })
        }

        const result = await getDrives()
        const lines = result.split("\n")
        const header = lines[0]
        const pos2 = header.indexOf("FSTYPE")
        const pos3 = header.indexOf("LABEL")
        const pos4 = header.indexOf("MOUNTPOINT")
        const pos5 = header.indexOf("MODEL")
                
        const filteredLines = lines.filter(n => !n.startsWith("NAME") && !n.startsWith("loop"))
        const drives = filteredLines.filter(n => !n.startsWith("└") && !n.startsWith("├"))
        const partitions = filteredLines.filter(n => n.startsWith("└") || n.startsWith("├"))
    
        const driveItems = drives.map(n => { return {
                name: n.substring(0, pos2).trim(),
                model: n.substring(pos5).trim()
            }
        })
    
        return partitions.map(n =>{ 
            const name = n.substring(2, pos2).trim() 
            let label = n.substring(pos3, pos4).trim() 
            if (!label) 
                label = driveItems.find(n => n.name == name.substr(0, 3))!.model
                
            const laststr = n.substr(pos5)
            const pos = laststr.indexOf(' ')
            const size = laststr.substr(pos).trim()

            return {
                displayName: name,
                description: label,
                size: Number.parseInt(size),
                type: n.substring(pos2, pos3).trim(),
                path: n.substring(pos4, pos5).trim(),
                isDirectory: true
            }
        }).filter(n => n.type && n.type != "swap")
    }
}
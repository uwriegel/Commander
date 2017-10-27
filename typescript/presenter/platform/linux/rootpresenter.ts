import { RootPresenter as RootPresenterBase, PresenterBase, RootItem } from '../../rootpresenter.js'
import { ColumnsControl }  from '../../../columnscontrol.js'

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

    protected processFill() {
        return new Promise<void>(async resolve => {

            const initialItems = [ {
                displayName: 'Home',
                description: "Persönlicher Ordner",
                size: -1,
                type: "",
                path: process.env.HOME!,
                isDirectory: true
            }]

            //var rootItems = await this.getRootItems()

            this.items = initialItems //.concat(rootItems)
            this.view.itemsChanged(0)

            resolve()
        })
    }

    protected createItem(item?: RootItem) : HTMLTableRowElement {
        const tr = document.createElement("tr")
        
        const linuxRootItem = item as LinuxRootItem
        if (item && !item.path)
            tr.classList.add("hidden")
    
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
        span.innerText = item ? item.size.toString() : 'W'
        tr.appendChild(td)
        
        tr.tabIndex = 1
        return tr
    }
}
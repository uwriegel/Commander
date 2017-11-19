import { RootPresenter as RootPresenterBase, PresenterBase, RootItem } from '../../rootpresenter.js'
import { ColumnsControl }  from '../../../columnscontrol.js'
import { run } from '../../../child-process.js'

export class RootPresenter extends RootPresenterBase {

    constructor() {
        super()
    }
    
    protected setColumns() {
        this.view.setColumns(new ColumnsControl(["Name", "Beschreibung", "Größe"], "4"))
    }

    protected async processFill() {

        let rootItems = await run<RootItem[]>("getDrives")
        for (let i = 0; i < 100; i++)
             rootItems = await run<RootItem[]>("getDrives")
        this.items = rootItems
        this.view.itemsChanged(0)
    }

    protected createItem(item?: RootItem) : HTMLTableRowElement {
        const tr = document.createElement("tr")
        
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
        span.innerText = item ? item.description : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemRightTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.size.toString() : 'W'
        tr.appendChild(td)
        
        tr.tabIndex = 1
        return tr
    }
}
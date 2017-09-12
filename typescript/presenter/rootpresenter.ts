import { PresenterBase }  from './presenterbase'
import { ColumnsControl }  from '../columnscontrol'
import * as driveList from 'drivelist'
import { FileHelper } from '../filehelper' 

interface RootItem
{
    displayName: string
    description: string
    size: number
}

// TODO: Promise
// TODO: Sortierung
// TODO: Icon
// TODO: Template
// TODO: CSS
class RootPresenter extends PresenterBase
{
    fill() {
        // TODO: Promise
        driveList.list((error: any, drives: RootItem[]) => {
            if (error) 
                throw error;

            this.items = drives
            this.view.itemsChanged(0)
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
        let td = document.createElement("td")
        let sp = document.createElement("span")
        sp.innerText = item ? item.displayName : 'W'
        td.appendChild(sp)
        tr.appendChild(td)
        
        td = document.createElement("td")
        sp = document.createElement("span")
        sp.innerText = item ? item.description : 'W'
        td.appendChild(sp)
        tr.appendChild(td)
        
        td = document.createElement("td")
        sp = document.createElement("span")
        sp.innerText = item ? FileHelper.formatFileSize(item.size) : 'W'
        td.appendChild(sp)

        tr.appendChild(td)
        tr.tabIndex = 1
        return tr
    }
}

export { RootPresenter }
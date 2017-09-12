import { PresenterBase }  from './presenterbase'
import { ColumnsControl }  from '../columnscontrol'

class CommanderViewPresenter extends PresenterBase
{
    fill() {
        this.items = [
            { 
                name: "Affe",
                description: "Ein Affe"
            },
            { 
                name: "Hund",
                description: "Mambo"
            },
            { 
                name: "Katze",
                description: "Perry"
            },
            { 
                name: "Pferd",
                description: "Tracy"
            },
            { 
                name: "Affe",
                description: "Ein Affe"
            },
            { 
                name: "Hund",
                description: "Mambo"
            },
            { 
                name: "Katze",
                description: "Perry"
            },
            { 
                name: "Pferd",
                description: "Tracy"
            },
            { 
                name: "Affe",
                description: "Ein Affe"
            },
            { 
                name: "Hund",
                description: "Mambo"
            },
            { 
                name: "Katze",
                description: "Perry"
            },
            { 
                name: "Pferd",
                description: "Tracy"
            },
            { 
                name: "Affe",
                description: "Ein Affe"
            },
            { 
                name: "Hund",
                description: "Mambo"
            },
            { 
                name: "Katze",
                description: "Perry"
            },
            { 
                name: "Pferd",
                description: "Tracy"
            },
        ];

        this.view.itemsChanged(0)
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
            }
            
        ], "4"))
    }

    protected createItem(name: string) : HTMLTableRowElement
    {
        const tr = document.createElement("tr")
        const td = document.createElement("td")
        const div = document.createElement("div")
        div.innerText = name
        td.appendChild(div)
        tr.appendChild(td)
        tr.tabIndex = 1
        return tr
    }
}

export { CommanderViewPresenter }
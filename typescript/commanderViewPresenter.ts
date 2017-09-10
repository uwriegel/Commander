import { Presenter }  from './presenter'

class CommanderViewPresenter implements Presenter
{
    registerView(view: IView): void {
        this.view = view
    }
    getItemsCount(): number {
        return this.items.length
    }

    insertItem(index: number, startDrag?: (() => void) | undefined): HTMLTableRowElement {
        return this.createItem(this.items[index].name)
    }

    insertMeasureItem(): HTMLTableRowElement {
        return this.createItem("T")
    }
    
    updateItem(itemElement: HTMLTableRowElement, index: number): void {
        throw new Error("Method not implemented.");
    }

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
            }
        ];

        this.view.itemsChanged(0)
    }

    private createItem(name: string) : HTMLTableRowElement
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

    private items: any[]
    private view: IView
}

export { CommanderViewPresenter }
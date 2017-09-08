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
        throw new Error("Method not implemented.");
    }

    insertMeasureItem(): HTMLElement {
        throw new Error("Method not implemented.");
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

    private items: any[]
    private view: IView
}

export { CommanderViewPresenter }
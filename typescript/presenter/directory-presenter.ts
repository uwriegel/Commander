import { PresenterBase, Item }  from './presenterbase'
import { ColumnsControl }  from '../columnscontrol'

export class DirectoryPresenter extends PresenterBase
{
    fill(path: string): Promise<void> {
        return new Promise((resolve, reject) => {

        })
    }

    protected createItem(name?: Item | undefined): HTMLTableRowElement {
        throw new Error("Method not implemented.")
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
            
        ], "6"))
    }
}
import { PresenterBase, Item }  from './presenterbase'

export class EmptyPresenter extends PresenterBase
{
    fill(path: string) { return new Promise<void>((r, rj) => r() )}

    protected setColumns() { }
    
    protected createItem(name?: Item): HTMLTableRowElement
    {
        const tr = document.createElement("tr")
        return tr
    }

    getSelectedDirectory(index: number) {
        return ""
    }
}


import { PresenterBase }  from './presenterbase'

export class EmptyPresenter extends PresenterBase
{
    fill(path: string) { return new Promise<void>((r, rj) => r() )}

    protected setColumns() { }
    
    protected createItem(name: string): HTMLTableRowElement
    {
        const tr = document.createElement("tr")
        return tr
    }
}


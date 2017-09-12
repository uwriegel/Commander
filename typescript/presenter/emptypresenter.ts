import { PresenterBase }  from './presenterbase'

class EmptyPresenter extends PresenterBase
{
    fill() { return new Promise<void>((r, rj) => r() )}

    protected setColumns() { }
    
    protected createItem(name: string): HTMLTableRowElement
    {
        const tr = document.createElement("tr")
        return tr
    }
}

export { EmptyPresenter }
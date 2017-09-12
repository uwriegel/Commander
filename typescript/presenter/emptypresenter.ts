import { PresenterBase }  from './presenterbase'

class EmptyPresenter extends PresenterBase
{
    protected setColumns() { }
    
    protected createItem(name: string): HTMLTableRowElement
    {
        const tr = document.createElement("tr")
        return tr
    }
}

export { EmptyPresenter }
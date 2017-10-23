import { PresenterBase }  from './presenterbase.js'

export class EmptyPresenter extends PresenterBase
{
    protected processFill() { return new Promise<void>(r => r() )}

    protected setColumns() { }
    
    protected createItem(): HTMLTableRowElement
    {
        const tr = document.createElement("tr")
        return tr
    }

    getSelectedPath() {
        return { selectedPath: "", currentPath: "" }
    }

    checkPath() {
        return false
    }
}


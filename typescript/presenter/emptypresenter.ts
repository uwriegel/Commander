import { PresenterBase, Item }  from './presenterbase'

export class EmptyPresenter extends PresenterBase
{
    protected processFill(selectPath?: string) { return new Promise<void>((r, rj) => r() )}

    protected setColumns() { }
    
    protected createItem(name?: Item): HTMLTableRowElement
    {
        const tr = document.createElement("tr")
        return tr
    }

    getSelectedPath(index: number) {
        return { selectedPath: "", currentPath: "" }
    }

    checkPath(path: string) {
        return false
    }
}


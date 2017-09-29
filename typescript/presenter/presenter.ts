import { View }  from '../view'

export interface Item
{
    isDirectory: boolean
}

interface Presenter {
    registerView(view: View): void
    getItemsCount(): number

    insertItem(index: number, startDrag?: (() => void)): HTMLTableRowElement
    /**
    * Einfügen eines Testeintrages, um die Ausmaße im DOM zu bestimmen
    */
    insertMeasureItem(): HTMLElement
    /**
     * Einfügen der Daten in die TableRow
    * @param itemElement
    * @param index Index des Eintrages, mit dem die TableRow gefüllt werden soll
    */
    updateItem(itemElement: HTMLTableRowElement, index: number): void

    fill(path: string): Promise<void>

    getItem(index: number): Item

    getSelectedDirectory(index: number): string

    checkPath(path: string): boolean

    readonly isDefault: boolean
}

export { Presenter }
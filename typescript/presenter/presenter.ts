import { View }  from '../view'

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
}

export { Presenter }
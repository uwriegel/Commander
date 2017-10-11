import { View }  from '../view'
import { Item } from '../model/item'

interface Presenter {
    registerView(view: View): void
    getItemsCount(): number

    getPath(): string

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

    fill(path: string, selectPath?: string): Promise<void>

    getItem(index: number): Item

    getSelectedPath(index: number): { selectedPath: string, currentPath: string }

    checkPath(path: string): boolean

    restrict(prefix: string, back?: boolean): boolean

    closeRestrict(noRefresh?: boolean): void

    readonly isDefault: boolean

    sort(columnIndex: number, ascending: boolean): boolean
}

export { Presenter }
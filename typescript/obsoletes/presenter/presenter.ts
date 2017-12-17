// import { View }  from '../view.js'
// import { Item } from '../model/item.js'

// interface Presenter {
//     registerView(view: View): void
//     getItemsCount(): number

//     getPath(): string

//     insertItem(index: number, startDrag?: (() => void)): HTMLTableRowElement
//     /**
//     * Einfügen eines Testeintrages, um die Ausmaße im DOM zu bestimmen
//     */
//     insertMeasureItem(): HTMLElement

//     updateSelection(itemElement: HTMLTableRowElement, index: number): void
    
//     updateItem(itemElement: HTMLTableRowElement, index: number): void

//     fill(path: string, selectPath?: string): Promise<void>

//     getItem(index: number): Item

//     getSelectedPath(index: number): { selectedPath: string, currentPath: string }

//     checkPath(path: string): boolean

//     restrict(prefix: string, back?: boolean): boolean

//     closeRestrict(noRefresh?: boolean): void

//     readonly isDefault: boolean

//     sort(columnIndex: number, ascending: boolean): boolean

//     toggleSelection(itemIndex: number): void

//     selectAll(select: boolean, startIndex?: number): void
// }

// export { Presenter }
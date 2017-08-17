interface FileSystemModule {
    createAccess(): FileSystemAccess
}

interface FileSystemAccess {
    getDrives(callback: (drives: Drive[])=>void)
    listFiles(directory: string, callback: (items: Item[])=>void);
}

declare class Drive {
    name: string
    description: string
    type: DriveItem
    size: number
}

declare class GetItemsInput {
    directory: string
    requestNumber: number
    id: string
}

declare class GetItemsOutput {
    currentDirectory: string
    items: Item[]
}

declare class Favorite
{
    name: string
    path: string
    item: string
}

declare class HistoryItem
{
    name: string
    path: string
}

declare class Item
{
    imageUrl: string
    name: string
    parent: string
    dateTime?: string
    isHidden?: boolean
    kind: ItemsKind
    updated?: string
    fileSize: number
    selected?: boolean

    version?: string
    exifDateTime?: string

    favoriteTarget?: string
    description?: string
    savedViewParent?: boolean

    serviceName?: string
    startType?: any
    status?: any 
    value?: any

    renamedName?: string
}

declare class ItemUpdate {
    index: number
    version: string
    dateTime: string
}

declare class ServiceItemUpdate
{
    serviceName: string    
    status: string
    imageUrl: string
}

declare class DragOver
{
    x: number
    y: number
}

declare class Drop
{
    x: number
    y: number
    dragDropKind: DragDropKind 
    directory: string
    items: Item[]
}

declare class DragFinished
{
    commanderId: string
    refresh: boolean
}

declare class CommanderEvent 
{
    id?: string 
    refresh?: boolean
    serviceItems: ServiceItemUpdate[]
    itemUpdates: ItemUpdate[]
    dragOver: DragOver
    dragLeave?: boolean
    drop: Drop
    dragFinished: DragFinished
}

declare class ConflictItem
{
    kind: ItemsKind
    imageUrl: string
    name: string
    sourceFileSize: number
    targetFileSize: number
    sourceVersion: string
    targetVersion: string
    sourceDateTime: string
    targetDateTime: string
}

interface IObservable {
    registerObservation(observator: IObservator)
    getItemsCount() 
}

interface IModel
{
    getItemSource(): Item[]
    getItem(index: number): Item
    getSelectedItems(): Item[]
}

interface IItemsViewModel
{
    setColumns(columnsControl: ColumnsControl)
    /**
     * Einfügen der View an der Position 'index'
    * @param index Der Index des zugehörigen Eintrages
    */
    insertItem(index: number, startDrag?: (() => void)): HTMLTableRowElement
    /**
    * Einfügen eines Testeintrages, um die Ausmaße im DOM zu bestimmen
    */
    insertMeasureItem()
    /**
     * Einfügen der Daten in die TableRow
    * @param itemElement
    * @param index Index des Eintrages, mit dem die TableRow gefüllt werden soll
    */
    updateItem(itemElement: HTMLTableRowElement, index: number)
}

interface IObservator
{
    ItemsCleared() 
    itemsChanged(lastCurrentIndex: number)
    updateItems()
    refreshSelection(itemIndex: number, isSelected: boolean)
    getCurrentItemIndex(): number
}

interface IOperationData
{
    operation: string
    sourceDir: string
    targetDir?: string
    items: Item[]
}

declare class OperationCheckResult
{
    conflictItems: ConflictItem[]
    result: OperationCheck
    exception?: string
}

declare class IColumn
{
    item: string
    class: string
    itemSortKind: ItemSortKind
}

interface ISelectionChanged
{
    selectionChanged()
}

declare class ExtendedRenameParams
{
    prefix: string
    initialValue: number
    digits: number
}


declare enum DragDropKind
{
    Copy,
    Move,
    Link
}

interface FileSystemModule {
    createAccess(): FileSystemAccess
    showHidden(value: boolean): void
}

interface FileSystemAccess {
    getRootItems(callback: (drives: Drive[])=>void): void
    listFiles(directory: string, callback: (items: GetItemsOutput)=>void): void
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
    registerObservation(observator: IObservator): void
    getItemsCount(): number
}

interface IModel
{
    getItemSource(): Item[]
    getItem(index: number): Item
    getSelectedItems(): Item[]
}

interface IObservator
{
    ItemsCleared(): void 
    itemsChanged(lastCurrentIndex: number): void
    updateItems(): void
    refreshSelection(itemIndex: number, isSelected: boolean): void
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

interface ISelectionChanged
{
    selectionChanged(): void
}

declare class ExtendedRenameParams
{
    prefix: string
    initialValue: number
    digits: number
}

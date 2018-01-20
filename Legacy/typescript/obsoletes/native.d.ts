
// declare enum DragDropKind
// {
//     Copy,
//     Move,
//     Link
// }

// // interface FileSystemModule {
// //     createAccess(): FileSystemAccess
// //     showHidden(value: boolean): void
// // }

// // interface FileSystemAccess {
// //     getRootItems(callback: (drives: Drive[])=>void): void
// //     listFiles(directory: string, callback: (items: GetItemsOutput)=>void): void
// // }

// declare class Drive {
//     name: string
//     description: string
//     type: DriveItem
//     size: number
// }

// declare class GetItemsInput {
//     directory: string
//     requestNumber: number
//     id: string
// }

// declare class Favorite
// {
//     name: string
//     path: string
//     item: string
// }

// declare class HistoryItem
// {
//     name: string
//     path: string
// }

// declare class ItemUpdate {
//     index: number
//     version: string
//     dateTime: string
// }

// declare class ServiceItemUpdate
// {
//     serviceName: string    
//     status: string
//     imageUrl: string
// }

// declare class DragOver
// {
//     x: number
//     y: number
// }

// // declare class Drop
// // {
// //     x: number
// //     y: number
// //     dragDropKind: DragDropKind 
// //     directory: string
// //     items: Item[]
// // }

// // declare class DragFinished
// {
//     commanderId: string
//     refresh: boolean
// }

// declare class CommanderEvent 
// {
//     id?: string 
//     refresh?: boolean
//     serviceItems: ServiceItemUpdate[]
//     itemUpdates: ItemUpdate[]
//     dragOver: DragOver
//     dragLeave?: boolean
//     //drop: Drop
//     dragFinished: DragFinished
// }

// interface ISelectionChanged
// {
//     selectionChanged(): void
// }

// declare class ExtendedRenameParams
// {
//     prefix: string
//     initialValue: number
//     digits: number
// }

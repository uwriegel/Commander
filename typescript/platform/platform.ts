
export enum Platform {
    Linux,
    Windows
}

export var platform = (function() {
    const process = require("process")
    return process.platform == "linux" ? Platform.Linux : Platform.Windows
})()

//export abstract class Platform {
    // getIconUrl(item: DirectoryItem) : string {
    //     if (item && item.isDirectory)
    //         return "images/folder.png"
    //     else if (!item)
    //         return "images/fault.png"
    //     else
    //         return this.internalGetIconUrl(item)
    // }

//     extendedUpdateItem(_: HTMLTableDataCellElement, __: HTMLTableRowElement, ___: Item) : void {
//     }

//     async insertExtendedInfos(_: string, __: Item[]) {
//         return new Promise<void>(resolve => resolve())
//     }

//     abstract sendIconResponse(request: string, response: Response) : void

//     abstract getAdditionalDirectoryColumns(): string[] 

//     


//     protected abstract internalGetIconUrl(item: DirectoryItem) : string 
        
//     
//}


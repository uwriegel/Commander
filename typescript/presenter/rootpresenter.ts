import { PresenterChooser } from './presenter-chooser.js'
import { PresenterBase }  from './presenterbase.js'
export { PresenterBase }  from './presenterbase.js'
import { RootItem } from '../model/root-item.js'
export { RootItem } from '../model/root-item.js'

// TODO: Favoriten, Historie
export abstract class RootPresenter extends PresenterBase {
    
    protected constructor() {
        super()
    }

    getSelectedPath(index: number) {
        var item = this.getItem(index) as RootItem
        return { selectedPath: item.path, currentPath: "" }
    }

    checkPath(path: string) {
        return path == PresenterChooser.rootSelector
    }

    // private getRootItems() {
        
    //     return new Promise<RootItem[]>((resolve, reject) => 
    //     driveList.list((error: any, drives: DriveItem[]) => {
    //             if (error) 
    //                 reject(error)
    //             drives = drives.sort((a, b) => a.displayName.localeCompare(b.displayName))
    //             const rootItems = drives.map(n => { return {
    //                 description: n.description,
    //                 displayName: n.displayName,
    //                 isDirectory: true,
    //                 size: n.size,
    //                 path: n.mountpoints.length > 0 ? (n.mountpoints[0].path.endsWith(':') ? n.mountpoints[0].path + '\\' : n.mountpoints[0].path) : ""
    //             }})
    //             resolve(rootItems)
    //         })
    //     )
    // }
}


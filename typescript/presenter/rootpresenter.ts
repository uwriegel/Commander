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
}


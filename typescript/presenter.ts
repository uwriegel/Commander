import { platform, Platform } from './platform.js'
import { View } from './view.js'
import { createColumnsControl } from './columnscontrol.js'

export interface Presenter {
    getType: ()=>Type
}

enum Type {
    Root,
    Directory
}

const Columns = [ 
    platform == Platform.Linux ? ["Name", "Beschreibung", "Mount", "Größe", "Typ"] : ["Name", "Beschreibung", "Größe"],
    ["Name"]
]

export function checkPresenter(path: string, currentPresenter: Presenter | undefined, view: View) {
    const newType = whichType(path)
    if (currentPresenter && currentPresenter.getType() == newType)
        return currentPresenter
    const type = newType
    
    const createColumns = createColumnsControl(view.getId())(type.toString())
    const columnsControl = createColumns(Columns[type])
    view.setColumns(columnsControl)

    function whichType(path: string) {
        if (path == "root") 
            return Type.Root
        else
            return Type.Directory
    }

    const getType = () => type

    return {
        getType: getType
    }
}
import { platform, Platform } from './platform.js'
import { View } from './view.js'
import { createColumnsControl, ColumnsControl } from './columnscontrol.js'

export interface Presenter {
    getType: ()=>Type
}

enum Type {
    Root,
    Directory
}

export function checkPresenter(path: string, currentPresenter: Presenter | undefined, view: View) {
    const newType = whichType(path)
    if (currentPresenter && currentPresenter.getType() == newType)
        return currentPresenter
    
    let columnsControl: ColumnsControl
    switch (newType) {
        case Type.Root: 
            const createRootColumns = createColumnsControl(view.getId())(Type.Root.toString())
            if (platform == Platform.Linux)
                columnsControl = createRootColumns(["Name", "Beschreibung", "Mount", "Größe", "Typ"])
            else
                columnsControl = createRootColumns(["Name", "Beschreibung", "Größe"])
            view.setColumns(columnsControl)
            break
        case Type.Directory: 
            break
    }
    

    function whichType(path: string) {
        if (path == "root") 
            return Type.Root
        else
            return Type.Directory
    }

    const getType = () => type

    var type = Type.Root
    
    return {
        getType: getType
    }
}
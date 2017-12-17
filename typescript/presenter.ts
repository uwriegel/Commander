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

export function checkPresenter(path: string, currentPresenter: Presenter | undefined, view: View) {
    const newType = whichType(path)
    if (currentPresenter && currentPresenter.getType() == newType)
        return currentPresenter
    
    switch (newType) {
        case Type.Root: 
            if (platform == Platform.Linux)
            // TODO: Abspeicherm der Spalten nach view left right und type Falsch: "4"
                view.setColumns(createColumnsControl(["Name", "Beschreibung", "Mount", "Größe", "Typ"], "4"))
            else
                view.setColumns(createColumnsControl(["Name", "Beschreibung", "Größe"], "4"))
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
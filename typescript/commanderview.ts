import { createTableView } from './tableview.js';
import { Item } from './item.js'
import { createItems } from './items.js'
import { Presenter, checkPresenter } from './presenter.js'

export interface CommanderView {
    getOtherView: ()=>CommanderView,
    setOtherView: (commanderView: CommanderView)=>void,
    refresh: ()=>void,
    focus: ()=>void,
    focusDirectoryInput: ()=>void,
    isDirectoryInputFocused: ()=>boolean,
    setOnFocus: (callback: () => void)=>void
    setOnCurrentItemChanged: (callback: (item: Item, path: string) => void)=>void
    changePath: (path: string, selectPath?: string)=>Promise<void> 
}

/**
 * Ein Commanderview besteht aus einer Tableview mit den Einträgen des aktuellen Verzeichnisses und einem Verzeichnis-Textfeldes
 * @param id Die ID des CommanderViews
 */
export function createCommanderView(id: string) {
    /**
    * Das andere CommanderView
    */
    let otherView: CommanderView

    const parent = document.getElementById(id)!

    /**
    * Das Eingabefeld zur Eingabe eines Verzeichnisses
    */
    const commanderDirectory = document.createElement("input")
    commanderDirectory.classList.add('directory')
    parent.appendChild(commanderDirectory)

    const commanderTable = document.createElement('div')
    commanderTable.classList.add('commanderTable')
    parent.appendChild(commanderTable)

    const tableView = createTableView(commanderTable)
    let items = createItems(tableView)
        
    /**
    * Das input-Element, welches die Beschränkungszeichen darstellt</var>
    */
    const restrictor = document.createElement('input')
    restrictor.classList.add('restrictor')
    restrictor.classList.add('restrictorHide')
    parent.appendChild(restrictor)

    tableView.setOnSelectedCallback((i, o, sp) => processItem(i, o, sp))
    commanderDirectory.onfocus = () => commanderDirectory.select

    commanderDirectory.onkeydown = e => {
        switch (e.which) {
            case 13: // Enter
                changePath(commanderDirectory.value)
                tableView.focus()
                break;
        }
    }

    commanderTable.onkeypress = e => keysRestrict(e)

    commanderTable.onkeydown = e => {
        switch (e.which) {
            case 8: // BACKSPACE
                restrictBack()
                e.preventDefault()
                break
            case 27: // ESC
                if (restrictor.value)
                    closeRestrict()
                // else
                //     this.itemsSorter.selectAll(false)
                break
            case 32: // _
                if (restrictor.value == "")
                    items.toggleSelection(tableView.getCurrentItemIndex())
                break
            case 35: // End
                if (e.shiftKey) {
                    items.selectAll(true, tableView.getCurrentItemIndex())
                    e.preventDefault()
                }
                break
            case 36: // Pos1
                if (e.shiftKey) {
                    items.selectAll(false, tableView.getCurrentItemIndex() + 1)
                    e.preventDefault();
                }
                break;
            case 45: // Einfg
                items.toggleSelection(tableView.getCurrentItemIndex())
                tableView.downOne()
                break
            case 82: // r
                if (e.ctrlKey) {
                    refresh()
                    e.preventDefault()
                }
                break
            case 107: // NUM +
                items.selectAll(true)
                break
            case 109: // NUM -
                items.selectAll(false)
                break
            case 120: // F9
                otherView.changePath(items.getPath())
                break
        }
    }
    
    commanderDirectory.onfocus = () => commanderDirectory.select()

    // TODO:
    //changePath(localStorage[id] || "root") // TODO: "root"

    function getOtherView() {
        return otherView;
    }

    function setOtherView(commanderView: CommanderView) {
        otherView = commanderView
    }

    function refresh() {
        changePath(items.getPath())
    }

    function focus() {
        tableView.focus()
    }

    function focusDirectoryInput() {
        commanderDirectory.focus()
    }

    function isDirectoryInputFocused() {
        return commanderDirectory.contains(document.activeElement)
    }

    function setOnFocus(callback: () => void) {
        tableView.setOnFocus(() => callback())
    }

    function setOnCurrentItemChanged(callback: (item: Item, path: string) => void) {
        tableView.setOnCurrentItemChanged(itemIndex => {
            const item = items.getItem(itemIndex)
            callback(item, items.getPath())
        })
    }

    async function changePath(path: string, selectPath?: string) {
        closeRestrict(true)
        presenter = checkPresenter(path, presenter, tableView)
     
        // TODO:        
        //await presenter.fill(path, selectPath)
        localStorage[id] = path
        commanderDirectory.value = path
    }

    function processItem(itemIndex: number, openWith: boolean, showProperties: boolean, fromOtherView?: boolean) {
        const { selectedPath, currentPath } = items.getSelectedPath(itemIndex)
        changePath(selectedPath, currentPath)
        tableView.focus()
    }

    function keysRestrict(e: KeyboardEvent) {
        let restrict = String.fromCharCode(e.charCode).toLowerCase()
        restrict = restrictor.value + restrict

        if (items.restrict(restrict))
            checkRestrict(restrict)
        if (!tableView.focus())
            tableView.pos1()

    }

    function checkRestrict(restrict: string) {
        restrictor.classList.remove('restrictorHide')
        restrictor.value = restrict
    }

    function closeRestrict(noRefresh?: boolean) {
        restrictor.classList.add('restrictorHide')
        restrictor.value = ""
        items.closeRestrict(noRefresh!)
        tableView.focus()
    }

    function restrictBack() {
        let restrict = restrictor.value
        restrict = restrict.substring(0, restrict.length - 1)
        if (restrict.length == 0)
            closeRestrict()
        else {
            if (items.restrict(restrict, true))
                checkRestrict(restrict)
            tableView.focus()
        }
    }

    var presenter: Presenter

    return {
        /**
        * Das andere CommanderView
        */
        getOtherView: getOtherView,
        setOtherView: setOtherView,
        refresh: refresh,
        focus: focus,
        focusDirectoryInput: focusDirectoryInput,
        isDirectoryInputFocused: isDirectoryInputFocused,
        setOnFocus: setOnFocus,// 
        setOnCurrentItemChanged: setOnCurrentItemChanged, 
        changePath: changePath 
    }
}


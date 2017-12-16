import { TableView }  from './tableview.js'
import { PresenterChooser } from './presenter/presenter-chooser.js'
import { EmptyPresenter } from './presenter/emptypresenter.js'
import { Item } from './model/item.js'
import { Presenter } from './presenter/presenter.js';


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

    let presenter: Presenter = new EmptyPresenter()

    const tableView = new TableView(commanderTable)
    tableView.Presenter = presenter
        
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
                    presenter.toggleSelection(tableView.getCurrentItemIndex())
                break
            case 35: // End
                if (e.shiftKey) {
                    presenter.selectAll(true, tableView.getCurrentItemIndex())
                    e.preventDefault()
                }
                break
            case 36: // Pos1
                if (e.shiftKey) {
                    presenter.selectAll(false, tableView.getCurrentItemIndex() + 1)
                    e.preventDefault();
                }
                break;
            case 45: // Einfg
                presenter.toggleSelection(tableView.getCurrentItemIndex())
                tableView.downOne()
                break
            case 82: // r
                if (e.ctrlKey) {
                    refresh()
                    e.preventDefault()
                }
                break
            case 107: // NUM +
                presenter.selectAll(true)
                break
            case 109: // NUM -
                presenter.selectAll(false)
                break
            case 120: // F9
                otherView.changePath(presenter.getPath())
                break
        }
    }
    
    commanderDirectory.onfocus = () => commanderDirectory.select()

    changePath(localStorage[id] || PresenterChooser.rootSelector)

    function getOtherView() {
        return otherView;
    }

    function setOtherView(commanderView: CommanderView) {
        otherView = commanderView
    }

    function refresh() {
        changePath(presenter.getPath())
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
            const item = presenter.getItem(itemIndex)
            callback(item, presenter.getPath())
        })
    }

    async function changePath(path: string, selectPath?: string) {
        closeRestrict(true)
        presenter = PresenterChooser.get(path, presenter, tableView)     
        await presenter.fill(path, selectPath)
        localStorage[id] = path
        commanderDirectory.value = path
    }

    //private processItem(itemIndex: number, openWith: boolean, showProperties: boolean, fromOtherView?: boolean) {
    function processItem(itemIndex: number, _: boolean, __: boolean, ___?: boolean) {
        const { selectedPath, currentPath } = presenter.getSelectedPath(itemIndex)
        changePath(selectedPath, currentPath)
        tableView.focus()
    }

    function keysRestrict(e: KeyboardEvent) {
        let restrict = String.fromCharCode(e.charCode).toLowerCase()
        restrict = restrictor.value + restrict

        if (presenter.restrict(restrict))
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
        presenter.closeRestrict(noRefresh!)
        tableView.focus()
    }

    function restrictBack() {
        let restrict = restrictor.value
        restrict = restrict.substring(0, restrict.length - 1)
        if (restrict.length == 0)
            closeRestrict()
        else {
            if (presenter.restrict(restrict, true))
                checkRestrict(restrict)
            tableView.focus()
        }
    }

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


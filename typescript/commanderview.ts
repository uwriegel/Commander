import { TableView }  from './tableview.js'
import { Presenter } from './presenter/presenterbase.js'
import { PresenterChooser } from './presenter/presenter-chooser.js'
import { EmptyPresenter } from './presenter/emptypresenter.js'
import { Item } from './model/item.js'

/**
 * Ein Commanderview besteht aus einer Tableview mit den Einträgen des aktuellen Verzeichnisses und einem Verzeichnis-Textfeldes
 * @param id Die ID des CommanderViews
 */
class CommanderView
{
    /**
    * Das andere CommanderView
    */
    otherView: CommanderView

    constructor(public id: string) {
        this.parent = document.getElementById(id)!

        this.commanderDirectory = document.createElement("input")
        this.commanderDirectory.classList.add('directory')
        this.parent.appendChild(this.commanderDirectory)

        const commanderTable = document.createElement('div')
        commanderTable.classList.add('commanderTable')
        this.parent.appendChild(commanderTable)

        this.tableView = new TableView(commanderTable)
        this.tableView.Presenter = this.presenter
        
        this.restrictor = document.createElement('input')
        this.restrictor.classList.add('restrictor')
        this.restrictor.classList.add('restrictorHide')
        this.parent.appendChild(this.restrictor)

        this.tableView.setOnSelectedCallback((i, o, sp) => this.processItem(i, o, sp))
        this.commanderDirectory.onfocus = () => this.commanderDirectory.select

        this.commanderDirectory.onkeydown = e => {
            switch (e.which) {
                case 13: // Enter
                    this.changePath(this.commanderDirectory.value)
                    this.tableView.focus()
                    break;
            }
        }

        commanderTable.onkeypress = e => this.keysRestrict(e)

        commanderTable.onkeydown = e => {
            switch (e.which) {
                case 8: // BACKSPACE
                    this.restrictBack()
                    e.preventDefault()
                    break
                case 27: // ESC
                    if (this.restrictor.value)
                        this.closeRestrict()
                    // else
                    //     this.itemsSorter.selectAll(false)
                    break
                case 32: // _
                    if (this.restrictor.value == "")
                        this.presenter.toggleSelection(this.tableView.getCurrentItemIndex())
                    break
                case 35: // End
                    if (e.shiftKey) {
                        this.presenter.selectAll(true, this.tableView.getCurrentItemIndex())
                        e.preventDefault()
                    }
                    break
                case 36: // Pos1
                    if (e.shiftKey) {
                        this.presenter.selectAll(false, this.tableView.getCurrentItemIndex() + 1)
                        e.preventDefault();
                    }
                    break;
                case 45: // Einfg
                    this.presenter.toggleSelection(this.tableView.getCurrentItemIndex())
                    this.tableView.downOne()
                    break
                case 82: // r
                    if (e.ctrlKey) {
                        this.refresh()
                        e.preventDefault()
                    }
                    break
                case 107: // NUM +
                    this.presenter.selectAll(true)
                    break
                case 109: // NUM -
                this.presenter.selectAll(false)
                    break
                case 120: // F9
                    this.otherView.changePath(this.presenter.getPath())
                    break
            }
        }
        
        this.commanderDirectory.onfocus = () => this.commanderDirectory.select()

        this.changePath(localStorage[this.id] || PresenterChooser.rootSelector)
    }

    refresh() {
        this.changePath(this.presenter.getPath())
    }

    focus() {
        this.tableView.focus()
    }

    focusDirectoryInput() {
        this.commanderDirectory.focus()
    }

    isDirectoryInputFocused() {
        return this.commanderDirectory.contains(document.activeElement)
    }

    setOnFocus(callback: () => void) {
        this.tableView.setOnFocus(() => callback())
    }

    setOnCurrentItemChanged(callback: (item: Item, path: string) => void) {
        this.tableView.setOnCurrentItemChanged(itemIndex => {
            const item = this.presenter.getItem(itemIndex)
            callback(item, this.presenter.getPath())
        })
    }

    async changePath(path: string, selectPath?: string) {
        this.closeRestrict(true)
        this.presenter = PresenterChooser.get(path, this.presenter, this.tableView)     
        await this.presenter.fill(path, selectPath)
        localStorage[this.id] = path
        this.commanderDirectory.value = path
    }

    //private processItem(itemIndex: number, openWith: boolean, showProperties: boolean, fromOtherView?: boolean) {
    private processItem(itemIndex: number, _: boolean, __: boolean, ___?: boolean) {
        const { selectedPath, currentPath } = this.presenter.getSelectedPath(itemIndex)
        this.changePath(selectedPath, currentPath)
        this.tableView.focus()
    }

    private keysRestrict(e: KeyboardEvent) {
        let restrict = String.fromCharCode(e.charCode).toLowerCase()
        restrict = this.restrictor.value + restrict

        if (this.presenter.restrict(restrict))
            this.checkRestrict(restrict)
        if (!this.tableView.focus())
            this.tableView.pos1()

    }

    private checkRestrict(restrict: string) {
        this.restrictor.classList.remove('restrictorHide')
        this.restrictor.value = restrict
    }

    private closeRestrict(noRefresh?: boolean) {
        this.restrictor.classList.add('restrictorHide')
        this.restrictor.value = ""
        this.presenter.closeRestrict(noRefresh)
        this.tableView.focus()
    }

    private restrictBack() {
        var restrict = this.restrictor.value
        restrict = restrict.substring(0, restrict.length - 1)
        if (restrict.length == 0)
            this.closeRestrict()
        else {
            if (this.presenter.restrict(restrict, true))
                this.checkRestrict(restrict)
            this.tableView.focus()
        }
    }

    private readonly tableView: TableView
    private readonly parent: HTMLElement  
    /**
    * Das input-Element, welches die Beschränkungszeichen darstellt</var>
    */
    private readonly restrictor: HTMLInputElement
    /**
    * Das Eingabefeld zur Eingabe eines Verzeichnisses
    */
    private readonly commanderDirectory: HTMLInputElement
    private presenter: Presenter = new EmptyPresenter()
}

export { CommanderView }

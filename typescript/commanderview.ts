import { TableView }  from './tableview'
import { PresenterBase, Presenter } from './presenter/presenterbase'
import { PresenterChooser } from './presenter/presenter-chooser'
import { EmptyPresenter } from './presenter/emptypresenter'

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

    constructor(public id: string)
    {
        this.parent = document.getElementById(id)!
        this.commanderDirectory = document.createElement("input")
        this.commanderDirectory.classList.add('directory')
        this.parent.appendChild(this.commanderDirectory)

        const commanderTable = document.createElement('div')
        commanderTable.classList.add('commanderTable')

        this.parent.appendChild(commanderTable)
        const restrictor = document.createElement('input')
        restrictor.classList.add('restrictor')
        restrictor.classList.add('restrictorHide')
        this.parent.appendChild(restrictor)

        this.tableView = new TableView(commanderTable)
        this.tableView.setPresenter(this.presenter)
        
        this.tableView.setOnSelectedCallback((i, o, sp) => this.processItem(i, o, sp))
        this.commanderDirectory.onfocus = () => this.commanderDirectory.select

        this.commanderDirectory.onkeydown = e => {
            switch (e.which) {
                case 13: // Enter
                    this.changeDirectory(this.commanderDirectory.value)
                    this.tableView.focus()
                    break;
            }
        }

        const currentDirectory = localStorage[this.id] || "root"
        this.changeDirectory(currentDirectory)
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

    async changeDirectory(path: string) {
        this.presenter = PresenterChooser.get(path, this.presenter, this.tableView)     
        await this.presenter.fill(path)
        localStorage[this.id] = path
        this.commanderDirectory.value = path
    }

    private processItem(itemIndex: number, openWith: boolean, showProperties: boolean, fromOtherView?: boolean) {
    //     this.lastCurrentDir = null
        var selectedDirectory = this.presenter.getSelectedDirectory(itemIndex)
        this.changeDirectory(selectedDirectory)
        this.tableView.focus()
    }

    private tableView: TableView
    private readonly parent: HTMLElement  
    /**
    * Das input-Element, welches die Beschränkungszeichen darstellt</var>
    */
    private restrictor: HTMLInputElement
    /**
    * Das Eingabefeld zur Eingabe eines Verzeichnisses
    */
    private commanderDirectory: HTMLInputElement
    private presenter: Presenter = new EmptyPresenter()
}

export { CommanderView }

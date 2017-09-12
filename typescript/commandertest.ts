import { ipcRenderer }  from 'electron'
import { Grid }  from './grid'
import { VerticalGrid }  from './vgrid'
import { Viewer }  from './viewer'
import { TableView }  from './tableview'
import { CommanderViewPresenter } from './presenter/commanderViewPresenter'
import { RootPresenter } from './presenter/rootpresenter'

/*

              Presenter (Steuert die Daten, passt die Views an)
                 /\
                /  \
               /    \
            Model  View (TableView, ColumnsControl)

        Der Presenter kann einen Sorter hinzugefügt bekommen

        Presenter 
*/


class Commander
{
    constructor()
    {
        const div = document.getElementById('testview')!
        this.tableView = new TableView(div)

        this.tableView.setPresenter(this.presenter)
        this.presenter.fill()

        ipcRenderer.on("darkTheme", (evt: any, dark: boolean) => this.setDarkTheme(dark))
    }

    setDarkTheme(activate: boolean) {
        if (activate) {
            const head = document.getElementsByTagName('head')[0]
            let link = document.createElement('link')
            link.rel = 'stylesheet'
            link.id = 'darkThemeStylesheet'
            link.type = 'text/css'
            link.href = 'styles/dark.css'
            link.media = 'all'
            head.appendChild(link)
        } else {
            const styleSheet = document.getElementById("darkThemeStylesheet")
            styleSheet!.remove()
        }
    }

    private readonly tableView: TableView
    //private readonly presenter = new CommanderViewPresenter()
    private readonly presenter = new RootPresenter()
}

const commanderInstance = new Commander()

// TODO: 
// document.ondragover = document.ondrop = (ev) => {
//     ev.preventDefault()
//   }
  
//   document.body.ondrop = (ev) => {
//     console.log(ev.dataTransfer.files[0].path)
//     ev.preventDefault()
//   }


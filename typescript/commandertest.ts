import { ipcRenderer }  from 'electron'
import { Grid }  from './grid'
import { VerticalGrid }  from './vgrid'
import { Viewer }  from './viewer'
import { TableView }  from './tableview'
import { RootPresenter } from './presenter/rootpresenter'
import { DirectoryPresenter } from './presenter/directory-presenter'

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
        ipcRenderer.on("darkTheme", (evt: any, dark: boolean) => this.setDarkTheme(dark))
    }

    async fill() {
        await this.presenter.fill("~")
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
    private readonly presenter = new RootPresenter()
    //private readonly presenter = new DirectoryPresenter()
}

const commanderInstance = new Commander()
commanderInstance.fill()
// TODO: 
// document.ondragover = document.ondrop = (ev) => {
//     ev.preventDefault()
//   }
  
//   document.body.ondrop = (ev) => {
//     console.log(ev.dataTransfer.files[0].path)
//     ev.preventDefault()
//   }


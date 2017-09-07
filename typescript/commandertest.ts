import { ipcRenderer }  from 'electron'
import { Grid }  from './grid'
import { VerticalGrid }  from './vgrid'
import { Viewer }  from './viewer'

class Commander
{
    constructor()
    {
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


class Main {
    constructor() {
        const gui = require('nw.gui')    
        const currentWindow = gui.Window.get()

        const data = localStorage['position']
        if (data) {
            const position = JSON.parse(data)
            currentWindow.x = position.x
            currentWindow.y = position.y
            currentWindow.width = position.width
            currentWindow.height = position.height
        }

        setTimeout(() => currentWindow.show(), 0)
        currentWindow.on('close', () => {
            localStorage['position'] = JSON.stringify( {
                x: currentWindow.x,
                y: currentWindow.y,
                width: currentWindow.width,
                height: currentWindow.height
            })
            currentWindow.close(true)
        })

        this.manageMenus(gui, currentWindow)
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

    manageMenus(gui: any, currentWindow: any) {

        const main = this

        const menu = new gui.Menu({ type: 'menubar'})
        
        const menuFile = new gui.MenuItem({
            label: 'Datei',
            submenu: new gui.Menu()
        })
        menu.append(menuFile)

        const menuNavigation = new gui.MenuItem({
            label: 'Navigation',
            submenu: new gui.Menu()
        })
        menu.append(menuNavigation)

        const menuSelection = new gui.MenuItem({
            label: 'Selektion',
            submenu: new gui.Menu()
        })
        menu.append(menuSelection)

        const menuView = new gui.MenuItem({
            label: 'Ansicht',
            submenu: new gui.Menu()
        })
        menu.append(menuView)

        menuFile.submenu.append(new gui.MenuItem({
            label:'Umbenennen',
            key : 'F2',
        }))
        menuFile.submenu.append(new gui.MenuItem({ type:'separator' }))
        menuFile.submenu.append(new gui.MenuItem({
            label:'Kopieren',
            key : 'F5',
        }))
        menuFile.submenu.append(new gui.MenuItem({
            label:'Verschieben',
            key : 'F6',
        }))
        menuFile.submenu.append(new gui.MenuItem({
            label:'Löschen',
            key : 'F8',
        }))
        menuFile.submenu.append(new gui.MenuItem({ type:'separator' }))
        menuFile.submenu.append(new gui.MenuItem({
            label:'Eigenschaften',
            key : 'Enter',
            modifiers : "Alt",
        }))
        menuFile.submenu.append(new gui.MenuItem({
            label:'Beenden',
            key : 'F4',
            modifiers : "Alt",
            click: () => currentWindow.close()
        }))

        menuNavigation.submenu.append(new gui.MenuItem({
            label:'Erstes Element',
            key : 'Home',
        }))
        menuNavigation.submenu.append(new gui.MenuItem({
            label:'Favoriten',
            key : 'F1',
        }))

        menuSelection.submenu.append(new gui.MenuItem({
            label:'Alles',
            key : '+',
            modifiers : "Num",
        }))
        menuSelection.submenu.append(new gui.MenuItem({
            label:'Nichts',
            key : '-',
            modifiers : "Num",
        }))

        menuView.submenu.append(new gui.MenuItem({
            label:'Versteckte Dateien',
            type: 'checkbox',
            key : 'H',
            modifiers : "Ctrl",
        }))
        menuView.submenu.append(new gui.MenuItem({
            label:'Dunkles Thema',
            type: 'checkbox',
            click: function() {
                main.setDarkTheme(this.checked)
            }
        }))
        menuView.submenu.append(new gui.MenuItem({ type:'separator' }))
        menuView.submenu.append(new gui.MenuItem({
            label:'Vorschau',
            type: 'checkbox',
            key : 'F3',
        }))
        menuView.submenu.append(new gui.MenuItem({ type:'separator' }))
        menuView.submenu.append(new gui.MenuItem({
            label:'Vollbild',
            key : 'F11',
            type: 'checkbox',
            click: function() {
                if (!this.checked)
                    currentWindow.leaveFullscreen()
                else
                    currentWindow.enterFullscreen()
            } 
        }))

        currentWindow.menu = menu
    }
}

new Main()
import { app, BrowserWindow, Menu, ipcMain }  from 'electron'
import * as settings from 'electron-settings'

app.on('ready', () => {

    const bounds = JSON.parse(settings.get("window-bounds", JSON.stringify({ 
        width: 800,
        height: 600
    })) as string)

    const mainWindow = new BrowserWindow(bounds)


    if (settings.get("isMaximized"))
        mainWindow.maximize()

    mainWindow.loadURL(`file://${__dirname}/../indextest.html`)
    
    mainWindow.on('close', () => {
        if (!mainWindow.isMaximized()) {
            const bounds = mainWindow.getBounds()
            settings.set("window-bounds", JSON.stringify(bounds))
        }
    })

    mainWindow.on('maximize', () => {
        const bounds = mainWindow.getBounds()
        settings.set("window-bounds", JSON.stringify(bounds))
        settings.set("isMaximized", true)
    })

    mainWindow.on('unmaximize', () => {
        settings.set("isMaximized", false)
    })

        const menu = Menu.buildFromTemplate([
            {
                label: '&Datei',
                submenu: [{
                    label: '&Umbenennen',
                    accelerator: "F2"
                },
                {
                    type: 'separator'
                },            
                {
                    label: '&Kopieren',
                    accelerator: "F5"
                },
                {
                    label: '&Verschieben',
                    accelerator: "F6"
                },
                {
                    label: '&Löschen',
                    accelerator: "F8"
                },
                {
                    type: 'separator'
                },            
                {
                    label: '&Eigenschaften',
                    accelerator: "Alt+Enter"
                },
                {
                    label: '&Beenden',
                    accelerator: 'Alt+F4',
                    role: "quit"
                }
            ]},
            {
                label: '&Navigation',
                submenu: [{
                    label: '&Erstes Element',
                    accelerator: 'Home'
                },
                {
                    label: '&Favoriten',
                    accelerator: 'F1'
                }
            ]},
            {
                label: '&Selektion',
                submenu: [{
                    label: '&Alles'
                },
                {
                    label: '&Nichts'
                }
            ]},
            {
                label: '&Ansicht',
                submenu: [{
                    label: '&Versteckte Dateien',
                    accelerator: "Ctrl+H",
                    type: "checkbox"
                },
                {
                    label: '&Dunkles Thema',
                    type: "checkbox",
                    click: evt => mainWindow.webContents.send("darkTheme", evt.checked)
                },
                {
                    type: 'separator'
                },            
                {
                    label: '&Vorschau',
                    type: "checkbox",
                    accelerator: "F3",
                    click: evt => mainWindow.webContents.send("preview", evt.checked)
                },
                {
                    type: 'separator'
                },            
                {
                    label: '&Vollbild',
                    click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
                    accelerator: "F11"
                },
                {
                    type: 'separator'
                },            
                {
                    label: '&Entwicklerwerkzeuge',
                    click: () => mainWindow.webContents.openDevTools(),
                    accelerator: "F12"
                }
            ]}
        ])
    
        Menu.setApplicationMenu(menu)
})
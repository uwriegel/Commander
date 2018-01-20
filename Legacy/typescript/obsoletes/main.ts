//     if (settings.get("isMaximized"))
//         mainWindow.maximize()

//     mainWindow.on('close', () => {
//         if (!mainWindow.isMaximized()) {
//             const bounds = mainWindow.getBounds()
//             settings.set("window-bounds", JSON.stringify(bounds))
//             mainWindow.webContents.send("closed")
//         }
//         child.send("kill")
//     })

//     mainWindow.on('maximize', () => {
//         const bounds = mainWindow.getBounds()
//         settings.set("window-bounds", JSON.stringify(bounds))
//         settings.set("isMaximized", true)
//     })

//     mainWindow.on('unmaximize', () => {
//         settings.set("isMaximized", false)
//     })


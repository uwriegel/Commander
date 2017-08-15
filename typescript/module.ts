
// TODO: Icons per http-Server bereitstellen
// TODO: Icons per c-Plugin (ILspy) aufbereiten


var commanderInstance: Commander 

document.addEventListener("DOMContentLoaded", () =>
{
    var gui = require('nw.gui')    
    var currentWindow = gui.Window.get()

    var data = localStorage['position']
    if (data) {
        var position = JSON.parse(data)
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

    commanderInstance = new Commander()   
})  
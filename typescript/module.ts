
// TODO: Window-State speichern und wiederherstellen
// TODO: Icons per http-Server bereitstellen
// TODO: Icons per c-Plugin (ILspy) aufbereiten

//import Orang from '/test'

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

    currentWindow.show()
    currentWindow.on('close', () => {
        localStorage['position'] = JSON.stringify( {
            x: currentWindow.x,
            y: currentWindow.y,
            width: currentWindow.width,
            height: currentWindow.height
        })
        currentWindow.close(true)
    })
    
    
    
    
    // var hugo = new Orang()
    // hugo.
//alert("Lohditt")
    var listBoxContainer = <HTMLElement>document.querySelector('#commanderView tbody')
    var commander = new Commander(listBoxContainer)
    commander.test()
})  
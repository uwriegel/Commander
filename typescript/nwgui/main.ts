class Main {
     constructor() {
        var gui = require("nw.gui")
        const mainWindow = gui.Window.get()
        
        const data = localStorage['position']
        if (data) {
            const position = JSON.parse(data)
            mainWindow.x = position.x
            mainWindow.y = position.y
            mainWindow.width = position.width
            mainWindow.height = position.height
        }

        setTimeout(() => mainWindow.show(), 0)

        mainWindow.on("close", () => {
            var xmlhttp = new XMLHttpRequest()
            xmlhttp.onload = () => {
                mainWindow.close(true);
            }
            xmlhttp.open('GET', 'http://localhost:20000/exit', true)
            xmlhttp.send()

            localStorage['position'] = JSON.stringify( {
                x: mainWindow.x,
                y: mainWindow.y,
                width: mainWindow.width,
                height: mainWindow.height
            })
        })

//     setDarkTheme(activate: boolean) {
//         if (activate) {
//             const head = document.getElementsByTagName('head')[0]
//             let link = document.createElement('link')
//             link.rel = 'stylesheet'
//             link.id = 'darkThemeStylesheet'
//             link.type = 'text/css'
//             link.href = 'styles/dark.css'
//             link.media = 'all'
//             head.appendChild(link)
//         } else {
//             const styleSheet = document.getElementById("darkThemeStylesheet")
//             styleSheet!.remove()
//         }
     }
 }

 new Main()
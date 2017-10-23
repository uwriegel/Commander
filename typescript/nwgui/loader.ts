const { fork } = require("child_process")
const child = fork("./scripts/child-processes/server.js")

const gui = require("nw.gui")
const loaderWindow = gui.Window.get()

let mainWindow: any

child.on("message", (m: any) => {
    if (m == "listening") {
        gui.Window.open("http://localhost:20000/commander.html", {
            focus: true,
            show: false
        })
        loaderWindow.close();
    }
})
 

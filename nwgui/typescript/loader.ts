console.log("Loading main module")
import { fork } from "child_process"

fork("./nwgui/scripts/child-processes/main.js")

console.log("main modul initialized")
 

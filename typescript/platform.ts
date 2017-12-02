
export enum Platform {
    Linux,
    Windows
}

 export var platform = (function() {
//     const process = require("process")
//     return process.platform == "linux" ? Platform.Linux : Platform.Windows
    return Platform.Linux
 })()



import { Server as LinuxServer } from './linux/server.js'

export function create() {
    // switch (platform) {
    //     case Platform.Linux:
           return new LinuxServer()
        // default:
        //     return undefined
//    }
}


import { Server as LinuxServer } from './linux/server.js'
import { Server as WindowsServer } from './windows/server.js'
import * as process from 'process'

export function create() {
    if (process.platform == "linux")
        return new LinuxServer()
    else
        return new WindowsServer()
}



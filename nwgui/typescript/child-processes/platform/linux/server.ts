import { Server as ServerBase } from '../../server.js'
import * as Path from 'path'
import { spawn } from 'child_process'

export class Server extends ServerBase {
    constructor() { super()
    
    console.log(__dirname)
    }

    protected sendIconResponse(query: string, response: any) {
        const process = spawn('python',["./assets/python/icons.py", query])
            process.stdout.on('data', (data: Buffer) => {
            const icon = data.toString('utf8').trim()
            if (icon != "None") 
                response.sendFile(icon)
            else
                response.sendFile(Path.join(__dirname, "../../../../../assets/images/fault.png"))
        })
    }
}
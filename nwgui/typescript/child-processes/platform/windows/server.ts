import { Server as ServerBase } from '../../server.js'
import * as Path from 'path'
import { spawn } from 'child_process'

export class Server extends ServerBase {
    constructor() { 
        super()
    }
    
    protected sendIconResponse(query: string, response: any) {
        const process = spawn('./CommanderWindowsIcons.exe',[ query ])
            process.stdout.on('data', (data: Buffer) => {
            // const icon = data.toString('utf8').trim()
            // if (icon != "None") 
            try {
                response.sendFile(data)
            }
            catch (err) {
                response.send(err)
            }
            // else
            //     response.sendFile(Path.join(__dirname, "../../../../../assets/images/fault.png"))
        })
    }
}
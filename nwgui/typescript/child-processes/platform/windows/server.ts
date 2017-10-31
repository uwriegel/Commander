import { Server as ServerBase } from '../../server.js'
import { Response } from 'express'
import { spawn } from 'child_process'

export class Server extends ServerBase {
    constructor() { 
        super()
    }
    
    protected sendIconResponse(query: string, response: Response) {
        const process = spawn('./CommanderWindowsIcons.exe',[ query ])
            process.stdout.on('data', (data: Buffer) => {
            response.writeHead(200,  {'Content-Type': 'image/png'})
            response.write(data)
            response.end()
        })
    }
}
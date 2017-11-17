const { spawn } = require("child_process")

export function start() {
    const process = spawn("dotnet", ["/home/uwe/Projekte/Commander/processes/bin/commander.dll"])
    
    process.stdout.on('data', (data: Buffer) => {
        const ergebnis = data.toString('utf8')
        alert(ergebnis)
    })    
    
    process.stdin.write('{"cmd": "getDrives", "requestId": "123"}\n')

}
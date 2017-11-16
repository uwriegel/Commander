const { spawn } = require("child_process")

export function start() {
    const proc = spawn("dotnet", ["/home/uwe/Projekte/Commander/processes/bin/commander.dll"])
    proc.stdout.on("readable", (data: any) => {
        alert(data)
    })  
    
    proc.stdin.write('{"cmd": "getDrives", "requestId": "123"}\n')

}
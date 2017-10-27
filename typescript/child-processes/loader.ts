const { spawn } = require("child_process")
const dotnet = spawn("dotnet", [".\\processes\\dotnet\\commander\\commander.net.dll"])

export function run(cmd: string) {
    dotnet.on('data', (data: Buffer) => {
        const lines = data.toString('utf8').trim()
        alert(lines)
    })
    dotnet.stdin.write(`${cmd}\n`)
    dotnet.stdin.flush()
}

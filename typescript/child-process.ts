const { spawn } = require("child_process")

export function start() {
    process.stdout.on('data', (data: Buffer) => {
        const result = JSON.parse(data.toString('utf8'))
        requests.get(result.requestId)!(result.driveInfoResult)
        requests.delete(result.requestId)
    })    
}

// TODO: cmd: enum
export function run<t>(cmd: string) {
    return new Promise<t>(async resolve => {
        const reqId = ++latestRequestId
        requests.set(reqId.toString(), resolve)
        process.stdin.write(`{"cmd": "${cmd}", "requestId": "${reqId}"}\n`)
    })
}

const process = spawn("dotnet", ["./processes/bin/commander.dll"])
const requests = new Map<string, (val:any)=>void>()
var latestRequestId = 0
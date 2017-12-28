open System.Diagnostics
open System.Net.Sockets
open System.Runtime.InteropServices

[<DllImport("hook.dll")>]
extern void Start()


printfn "Starting Commander service"
let rec checkPort port = 
    try
        use client = new TcpClient ("localhost", port)
        client.GetStream () |> ignore
        checkPort <| port + 1
    with
    | _ -> port
let port = checkPort 20000
printfn "using port %d" port

let info = ProcessStartInfo (@"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", sprintf "--app=http://localhost:%d/commander.html" <| port)
info.UseShellExecute <- true
let p = new Process()
p.EnableRaisingEvents <- true
p.StartInfo <- info
p.Start() |> ignore
Start() 


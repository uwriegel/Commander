open System.Diagnostics
open System.Net.Sockets
open System.Runtime.InteropServices

[<DllImport("hook.dll")>]
extern void Start()

printfn "Starting Commander service"

let rec checkPort port = 
    try
        let listener = IPV6ListenerFactory.create port
        listener.Listener.Start()
        listener.Listener.Stop()
        port
    with
    | _ -> checkPort <| port + 1
 

let port = checkPort 20000
printfn "using port %d" port

let info = ProcessStartInfo (@"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", sprintf "--app=http://localhost:%d/commander.html" <| port)
info.UseShellExecute <- true
let p = new Process()
p.EnableRaisingEvents <- true
p.StartInfo <- info
p.Start() |> ignore
Start() 


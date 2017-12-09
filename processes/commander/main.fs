open Server
open Request
open System.Threading
open System.Diagnostics
open System.Net.Sockets
open Platform

// TODO: GetDrives Linux mit DVD

printfn "Starting Test Server"


// TODO: perhaps faster in C without cin and startprocess
let psi = ProcessStartInfo ("/bin/bash", "-c \"lsblk --bytes --output NAME,LABEL,MOUNTPOINT,FSTYPE,SIZE\"")
psi.RedirectStandardOutput <- true
psi.CreateNoWindow <- true   
use child = new Process () //use
child.StartInfo <- psi
child.Start () |> ignore
let result = child.StandardOutput.ReadToEnd ()






let rec checkPort port = 
    try
        use client = new TcpClient ("localhost", port)
        client.GetStream () |> ignore
        checkPort <| port + 1
    with
    | _ -> port
let port = checkPort 20000
printfn "using port %d" port


let configuration = Configuration.create {
        Configuration.createEmpty() with 
            Port = port 
            WebRoot = "."
            asyncRequest = asyncRequest
            onNewWebSocket = onNewWebSocket
            favicon = if windows then "assets\images\kirk2.png" else "assets/images/kirk2.png"
    }

ThreadPool.SetMinThreads(60, 60) |> ignore

try
    let server = create configuration 
    server.start ()
    let chrome = if windows then @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" else "google-chrome"
    let info = ProcessStartInfo (chrome, sprintf "--app=http://localhost:%d/commander.html" <| port)
    info.UseShellExecute <- true
    let p = new Process()
    p.EnableRaisingEvents <- true
    p.StartInfo <- info
    p.Start() |> ignore    
    waitHandle.WaitOne () |> ignore
    server.stop ()
with
    | ex -> 
        printfn "Fehler: %O" ex


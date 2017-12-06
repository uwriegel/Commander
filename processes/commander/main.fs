open Server
open Request
open System.Threading
open System.Diagnostics
open System.Runtime.InteropServices
open System.Net.Sockets

// TODO: fawikon
// TODO: GetDrives Linux mit DVD

printfn "Starting Test Server"

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
    }

ThreadPool.SetMinThreads(60, 60) |> ignore

try
    let os = RuntimeInformation.OSDescription 
    let windows = os.StartsWith "Microsoft"
    let server = create configuration { asyncRequest = asyncRequest; onNewWebSocket = onNewWebSocket }
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


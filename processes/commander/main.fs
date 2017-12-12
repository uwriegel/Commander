open Server
open Request
open System.Threading
open System.Diagnostics
open System.Net.Sockets
open Platform


// TODO: ReadFir in DirectoryPresenter
// TODO: getFiles in FileSystem.ts
// open System.Runtime.InteropServices
// open System.Text

// [<DllImport("libc")>]
// extern System.IntPtr getcwd(System.Text.StringBuilder sb, int length)


// let sb = StringBuilder(400)
// let affe = getcwd (sb, sb.Capacity)

// printfn "pwd: %s" <|sb.ToString ()

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


open Server
open Request
open System.Threading
open System.Diagnostics
open System.Runtime.InteropServices

// TODO: Portscanner
// Ubuntu Theme
// TODO: fawikon

printfn "Starting Test Server"
let configuration = Configuration.create {
        Configuration.createEmpty() with 
            Port = 20000; 
            WebRoot = "."
    }

ThreadPool.SetMinThreads(60, 60) |> ignore

try
    let os = RuntimeInformation.OSDescription 
    let windows = os.StartsWith "Microsoft"
    let server = create configuration { asyncRequest = asyncRequest; onNewWebSocket = onNewWebSocket }
    server.start ()
    let chrome = if windows then @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" else "google-chrome"
    let info = ProcessStartInfo (chrome, "--app=http://localhost:20000/commander.html")
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


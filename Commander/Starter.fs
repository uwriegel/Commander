module Starter

open System.Threading
open Server
open System
open System.IO

let rec checkPort port = 
    try
        let listener = IPV6ListenerFactory.create port
        listener.Listener.Start()
        listener.Listener.Stop()
        port
    with
    | _ -> checkPort <| port + 1

let retrieveWebRoot (path: string) = 
    let webroot = path.Substring(0, path.IndexOf(@"\commander.exe", StringComparison.CurrentCultureIgnoreCase))
    let pos = webroot.IndexOf(@"\commander\bin\debug", StringComparison.CurrentCultureIgnoreCase)
    if pos <> -1 then
        Path.Combine(webroot.Substring(0, pos), "WebApp")
    else
        path

let start(path: string, hwnd: int64) =
    let port = checkPort 20000

    let configuration = Configuration.create {
        Configuration.createEmpty() with 
            Port = port 
            WebRoot = retrieveWebRoot path
            //asyncRequest = asyncRequest
            //onNewWebSocket = onNewWebSocket
            favicon = "assets\images\kirk.png"
    }

    ThreadPool.SetMinThreads(60, 60) |> ignore

    try
        let server = create configuration 
        server.start ()
    with
        | ex -> 
            printfn "Fehler: %O" ex
    ()




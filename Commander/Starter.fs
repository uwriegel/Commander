module Starter

open System.Threading
open Server

let rec checkPort port = 
    try
        let listener = IPV6ListenerFactory.create port
        listener.Listener.Start()
        listener.Listener.Stop()
        port
    with
    | _ -> checkPort <| port + 1

let start(path: string, hwnd: int64) =
    let port = checkPort 20000

    let configuration = Configuration.create {
        Configuration.createEmpty() with 
            Port = port 
            WebRoot = @"C:\Users\urieg\Documents\Projekte\Commander" // TODO: anhand des Modulpaths berechnen
            //asyncRequest = asyncRequest
            //onNewWebSocket = onNewWebSocket
            favicon = "assets\images\kirk2.png"
    }

    ThreadPool.SetMinThreads(60, 60) |> ignore

    try
        let server = create configuration 
        server.start ()
    with
        | ex -> 
            printfn "Fehler: %O" ex
    ()




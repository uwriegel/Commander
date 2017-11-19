open Configuration
open Server

[<EntryPoint>]
let main args =
    printfn "Starting Test Server"
    let configuration = Configuration.create {
            Configuration.createEmpty() with 
                Port = 20000; 
                WebRoot = args.[0]
        }

    try
        let server = create configuration
        server.start ()
        stdin.ReadLine() |> ignore
        server.stop ()
        0
    with
        | ex -> 
            printfn "Fehler: %O" ex
            -1
    

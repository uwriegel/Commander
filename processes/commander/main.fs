open Json
open FileSystem
open Commands
open System
open System.Threading
open System.Text

let locker = Object ()

let input = Console.OpenStandardInput()
let output = Console.OpenStandardOutput()

let run (requestId: string) action = 
    ThreadPool.QueueUserWorkItem (fun _ -> 
        action()

        // Create Ergebnis mit requestId
        lock locker (fun () ->
            let buffer = Encoding.UTF8.GetBytes("Nichts ist das älles!")
            // output.Write Länge buffer.Length binär!!
            output.Write (buffer, 0, buffer.Length)
        )
    ) |> ignore

let rec waitForAction () = 
    let buffer = Array.zeroCreate 20000
    let read = input.Read (buffer, 0, buffer.Length)
    let cmd = deserializeJson<Command> buffer read
    match cmd with
    | cmd when cmd.cmd = "stop" ->
        ()
    | cmd when cmd.cmd = "getDrives" ->
        run cmd.requestId getDrives
        waitForAction ()
    | _ ->
        printfn "cmd: %s - text: %s" cmd.cmd "Nichts"  
        waitForAction () 

waitForAction () 


module Request
open Session
open System.Threading

let waitHandle = new ManualResetEvent false

let onWebSocketClose _ =
    waitHandle.Set () |> ignore

let onNewWebSocket _ __ = 
    {
        id = ""
        onClose = onWebSocketClose
    }

let asyncRequest requestSession = 
    async {
        match requestSession.query.Value.method with
        | "getDrives" ->
            let result = FileSystem.getDrives ()
            do! requestSession.asyncSendJson (result :> obj)
            return true
        | "exit" -> 
            waitHandle.Set () |> ignore
            return false
        | _ -> return false
    }
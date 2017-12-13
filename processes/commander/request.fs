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
        | "getItems" ->
            let test = requestSession.query.Value
            match test.Query "path" with
            | Some path -> 
                let result = FileSystem.getItems path
                do! requestSession.asyncSendJson (result :> obj)
            // TODO: SendErr                
            | None -> do! requestSession.asyncSendJson null
            return true
        | _ -> return false
    }
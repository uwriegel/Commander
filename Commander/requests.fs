module Requests
open Session

let asyncRequest (requestSession: RequestSession) = 
    async {
        match requestSession.query.Value.method with
        | "getItems" ->
            //requestSession.asyncSendJson
            let test = requestSession.query.Value
            let param1 = test.Query "param1" 
            let param2 = test.Query "param2"
            let param3 = test.Query "param41"

            //let command = {
            //    cmd = "Kommando"
            //    requestId = "RekwestEidie"
            //}
            ////System.Threading.Thread.Sleep 3
            //do! requestSession.asyncSendJson (command :> obj)
            return true
        | _ -> return false
    }
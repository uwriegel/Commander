module Request
open ResponseData

open System.Runtime.Serialization
[<DataContract>]
type Command = {
    [<DataMember>]
    mutable cmd: string

    [<DataMember>]
    mutable requestId: string
}

let asyncRequest (url: string) responseData = 
    async {
        match responseData.query.Value.method with
        | "affe" ->
            let test = responseData.query.Value
            let param1 = test.Query "param1" 
            let param2 = test.Query "param2"
            let param3 = test.Query "param41"

            let command = {
                cmd = "Kommando12"
                requestId = "RekwestEidie34"
            }
            //System.Threading.Thread.Sleep 3
            do! Response.asyncSendJson responseData command
            return true
        | _ -> return false
    }
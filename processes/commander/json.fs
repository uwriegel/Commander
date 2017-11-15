module Json
open System.IO
open System.Runtime.Serialization.Json
open System

let deserializeJson<'a> bytes length =
    let jsonSerializer = DataContractJsonSerializer(typedefof<'a>)

    use stream = new MemoryStream (bytes, 0, length)
    jsonSerializer.ReadObject stream :?> 'a
    
let serializeJson (json: Object) =
    let jsonSerializer = DataContractJsonSerializer(json.GetType ())

    use stream = new MemoryStream ()
    jsonSerializer.WriteObject (stream, json)
    stream.Capacity <- int stream.Length
    stream.GetBuffer ()

module Json
open System.IO
open System.Runtime.Serialization.Json

let deserializeJson<'a> bytes length =
    let jsonSerializer = DataContractJsonSerializer(typedefof<'a>)

    use stream = new MemoryStream (bytes, 0, length)
    jsonSerializer.ReadObject(stream) :?> 'a
    

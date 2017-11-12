module Commands
open System.Runtime.Serialization

[<DataContract>]
type Command = {
    [<DataMember>]
    mutable cmd: string

    [<DataMember>]
    mutable requestId: string
    // [<DataMember(EmitDefaultValue = false)>]
    // mutable text: string
}

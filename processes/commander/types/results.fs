module Results
open System.Runtime.Serialization

[<DataContract>]
type DriveInfoResult = {
    [<DataMember>]
    mutable name: string
}

[<DataContract>]
type Result = {
    [<DataMember>]
    mutable requestId: string

    [<DataMember(EmitDefaultValue = false)>]
    mutable driveInfoResult: DriveInfoResult[]
}

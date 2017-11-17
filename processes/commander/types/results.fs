module Results
open System.Runtime.Serialization

[<DataContract>]
type DriveInfoResult = {
    [<DataMember>]
    mutable displayName: string
    [<DataMember>]
    mutable path: string
    [<DataMember>]
    mutable description: string
    [<DataMember>]
    mutable size: int64
}

[<DataContract>]
type Result = {
    [<DataMember>]
    mutable requestId: string

    [<DataMember(EmitDefaultValue = false)>]
    mutable driveInfoResult: DriveInfoResult[]
}

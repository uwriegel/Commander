module Results



}

[<DataContract>]
type Result = {
    [<DataMember>]
    mutable requestId: string

    [<DataMember(EmitDefaultValue = false)>]
    mutable driveInfoResult: DriveInfoResult[]
}

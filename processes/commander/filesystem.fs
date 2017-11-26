module FileSystem
open System.IO
open System.Runtime.Serialization

[<DataContract>]
type DriveInfoResult = {
    [<DataMember>]
    mutable displayName: string
    [<DataMember>]
    mutable path: string
    [<DataMember(EmitDefaultValue = false)>]
    mutable description: string
    [<DataMember(EmitDefaultValue = false)>]
    mutable size: int64
    [<DataMember(EmitDefaultValue = false)>]
    mutable isHidden: bool
}
let getDrives () = 
    DriveInfo.GetDrives () 
    |> Seq.sortBy (fun n -> n.Name)
    |> Seq.map (fun n -> 
        { 
            displayName = n.Name
            path = n.Name
            description = n.VolumeLabel
            size = n.TotalSize
            isHidden = not n.IsReady
        })
    |> Seq.toArray

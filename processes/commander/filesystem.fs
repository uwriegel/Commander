module FileSystem
open System.IO
open System.Runtime.Serialization
open System.Runtime.InteropServices

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

[<DllImport("kernel32.dll", BestFitMapping = false, CharSet = CharSet.Auto, SetLastError = true)>]
extern bool GetDiskFreeSpaceEx(string drive, uint64 *freeBytesForUser, uint64 *totalBytes, uint64 *freeBytes)

let isReady drive = 
    let mutable freeBytesForUser = 0UL
    let mutable totalBytes = 0UL
    let mutable freeBytes = 0UL
    GetDiskFreeSpaceEx (drive, &&freeBytesForUser, &&totalBytes, &&freeBytes)

let getDrives () = 
    let driveNames = Directory.GetLogicalDrives ()
    driveNames
    |> Seq.filter (fun n -> isReady <| n)    
    |> Seq.map (fun n -> DriveInfo n)
    |> Seq.sortBy (fun n -> n.Name)
    |> Seq.map (fun n -> 
        { 
            displayName = n.Name
            path = n.Name
            description = n.VolumeLabel
            size = n.TotalSize
            isHidden = false
        })
    |> Seq.toArray

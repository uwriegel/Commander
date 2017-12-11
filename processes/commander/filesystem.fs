module FileSystem
open System.IO
open System.Runtime.Serialization
open Api
open Platform
open System.Diagnostics
open System.ComponentModel
open System.Collections.Generic
#nowarn "51"

[<DataContract>]
type DriveInfoResult = {
    [<DataMember>]
    mutable displayName: string
    [<DataMember>]
    mutable driveType: string
    [<DataMember>]
    mutable path: string
    [<DataMember(EmitDefaultValue = false)>]
    mutable description: string
    [<DataMember(EmitDefaultValue = false)>]
    mutable size: int64
    [<DataMember(EmitDefaultValue = false)>]
    mutable isHidden: bool
}
let parseSize str =
   match System.Int64.TryParse(str) with
   | (true,int) -> int
   | _ -> -1L

let isReady drive = 
    let mutable freeBytesForUser = 0UL
    let mutable totalBytes = 0UL
    let mutable freeBytes = 0UL
    GetDiskFreeSpaceEx (drive, &&freeBytesForUser, &&totalBytes, &&freeBytes)

let getWindowsDrives () = 
    let driveNames = Directory.GetLogicalDrives ()
    (Seq.map ((fun n -> DriveInfo n) >> (fun n -> 
        { 
            displayName = n.Name
            driveType = ""
            path = n.Name
            description = n.VolumeLabel
            size = n.TotalSize
            isHidden = false
        })) (driveNames
    |> Seq.filter (fun n -> isReady <| n)))
    |> Seq.sortByDescending (fun n -> not n.isHidden, n.displayName)
    |> Seq.toArray

let trimLinuxDriveChild (str: string) =
    let result = if str.StartsWith("└") || str.StartsWith("├") then str.Substring 2 else str
    result.Trim ()

let getLinuxDrives () = 
    // TODO: perhaps faster in C without cin and startprocess
    let psi = ProcessStartInfo ("/bin/bash", "-c \"lsblk --bytes --output SIZE,NAME,LABEL,MOUNTPOINT,FSTYPE\"")
    psi.RedirectStandardOutput <- true
    psi.CreateNoWindow <- true   
    use child = new Process () 
    child.StartInfo <- psi
    child.Start () |> ignore
    let result = child.StandardOutput.ReadToEnd ()
    let lines = 
        result.Split ([|'\n'|], System.StringSplitOptions.RemoveEmptyEntries) 
        |> Array.toList
    match lines with
    | [] -> []
    | first::rest ->
        let pos2 = first.IndexOf("NAME")
        let pos3 = first.IndexOf("LABEL")
        let pos4 = first.IndexOf("MOUNT")
        let pos5 = first.IndexOf("FSTYPE")
        rest 
        |> List.filter (fun n -> n.Contains("└") || n.Contains("├") || n.Contains("/media/"))
        |> List.map (fun n -> 
            let path = n.Substring(pos4, pos5 - pos4).Trim()
            {
                size = parseSize <| n.Substring(0, pos2).Trim()
                displayName = n.Substring(pos2, pos3 - pos2) |> trimLinuxDriveChild
                description = n.Substring(pos3, pos4 - pos3).Trim()
                path = path
                driveType = n.Substring(pos5).Trim()
                isHidden = path = ""
            })
        |> List.sortBy (fun n -> n.isHidden, n.path)
    |> List.append
        [{
            size = -1L
            displayName = "home"
            description = ""
            path = "/"
            driveType = ""
            isHidden = false
        }]
    |> List.toArray
let getDrives () = if windows then getWindowsDrives () else getLinuxDrives ()
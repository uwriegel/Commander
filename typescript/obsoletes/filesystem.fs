module FileSystem
open System.IO
open Results

let getDrives requestId = 
    let driveInfoResult = 
        DriveInfo.GetDrives () 
        |> Seq.filter (fun drive -> drive.IsReady)
        |> Seq.sortBy (fun n -> n.Name)
        |> Seq.map (fun n -> 
            { 
                displayName = n.Name
                path = n.Name
                description = n.VolumeLabel
                size = n.TotalSize
            })
        |> Seq.toArray
    {   
        requestId = requestId
        driveInfoResult = driveInfoResult
    }

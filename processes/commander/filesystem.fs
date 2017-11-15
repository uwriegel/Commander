module FileSystem
open System.IO
open Results

let getDrives requestId = 
    let driveInfoResult = 
        DriveInfo.GetDrives () 
        |> Seq.filter (fun drive -> drive.IsReady)
        |> Seq.sortBy (fun n -> n.Name)
        |> Seq.map (fun n -> { name = n.Name })
        |> Seq.toArray
    {   
        requestId = requestId
        driveInfoResult = driveInfoResult
    }

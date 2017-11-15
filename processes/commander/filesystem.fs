module FileSystem
open System.IO
let getDrives () = 
    let drives = 
        DriveInfo.GetDrives () 
        |> Seq.filter (fun drive -> drive.IsReady)
        |> Seq.sortBy (fun n -> n.Name)
    let affe = drives 
    ()
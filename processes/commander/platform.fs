module Platform
open System.Runtime.InteropServices
let os = RuntimeInformation.OSDescription 
let windows = os.StartsWith "Microsoft"

module Api
open System.Runtime.InteropServices

[<DllImport("kernel32.dll", BestFitMapping = false, CharSet = CharSet.Auto, SetLastError = true)>]
extern bool GetDiskFreeSpaceEx(string drive, uint64 *freeBytesForUser, uint64 *totalBytes, uint64 *freeBytes)

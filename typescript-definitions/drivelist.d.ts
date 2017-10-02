interface Mountpoint {
    path: string
}
interface DriveItem {
    displayName: string
    description: string
    size: number,
    mountpoints: Mountpoint[]
}

declare module 'drivelist' {

    function list(callback: (error: any, drives: DriveItem[]) => void): void
}





enum DriveItem {
    Unknown,
    HardDrive,
    Rom,
    Removable,
    Network,
    Registry,
    Services
}

class FileSystem
{
    constructor()
    {
        this.access = fs.createAccess()
    }

    static set showHidden(value: boolean)
    {
        fs.showHidden(value)
    }

    getFiles(directory: string)
    {
        return new Promise<GetItemsOutput>((resolve, reject) => {
            this.access.listFiles(directory, items => resolve(items))
        })
    }

    getRootItems()
    {
        return new Promise<GetItemsOutput>((resolve, reject) => {
            this.access.getRootItems(drives => {
                resolve({
                    currentDirectory: "root",
                    items: drives.map(drive => {
                        return {
                            name: drive.name,
                            description: drive.description,
                            fileSize: drive.size ? drive.size : -1,
                            parent: null,
                            kind: ItemsKind.Drive,
                            imageUrl: getDriveIcon(drive.type)
                        }
                    }).concat([                       
                        {
                            name: "History",
                            description: "Verlauf der Verzeichnisse",
                            kind: ItemsKind.Drive,
                            parent: null,
                            fileSize: -1,
                            imageUrl: "images/history.png"
                        },
                        {
                            name: "Favoriten",
                            description: "Abgespeicherte Verzeichnispfade",
                            kind: ItemsKind.Drive,
                            parent: null,
                            fileSize: -1,
                            imageUrl: "images/favorite.png"
                        }
                    ])
                })

                function getDriveIcon(driveType: DriveItem)
                {
                    switch (driveType)
                    {
                        case DriveItem.Network:
                            return "images/networkdrive.png"
                        // case DriveItem.Removable:
                        case DriveItem.Rom:
                            return "images/rom.png"
                        case DriveItem.Registry:
                            return "images/registry.png"
                        case DriveItem.Services:
                            return "images/service.png"
                        default:
                            return "images/drive.png"
                    }
                }
            })            
        })
    }

    private access: FileSystemAccess
}

var fs //= <FileSystemModule>require('./plugins/filesystem') 

var DriveItem;
(function (DriveItem) {
    DriveItem[DriveItem["Unknown"] = 0] = "Unknown";
    DriveItem[DriveItem["HardDrive"] = 1] = "HardDrive";
    DriveItem[DriveItem["Rom"] = 2] = "Rom";
    DriveItem[DriveItem["Removable"] = 3] = "Removable";
    DriveItem[DriveItem["Network"] = 4] = "Network";
})(DriveItem || (DriveItem = {}));
var Drives;
(function (Drives) {
    /**
     * Abfrage der Laufwerke
     * @param fileSystemAccess
     */
    function getItems(fileSystemAccess) {
        var drives = fileSystemAccess.getDrives();
        return {
            currentDirectory: "drives",
            items: drives.map(drive => {
                return {
                    name: drive.name,
                    description: drive.description,
                    fileSize: drive.size,
                    parent: null,
                    kind: ItemsKind.Drive,
                    imageUrl: getDriveIcon(drive.type)
                };
            }).concat([
                {
                    name: "Registry",
                    description: "Windows Registrierungsdatenbank",
                    kind: ItemsKind.Drive,
                    parent: null,
                    fileSize: -1,
                    imageUrl: "images/registry.png"
                },
                {
                    name: "Dienste",
                    description: "Dienstesteuerung",
                    kind: ItemsKind.Drive,
                    parent: null,
                    fileSize: -1,
                    imageUrl: "images/service.png"
                },
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
        };
        function getDriveIcon(driveType) {
            switch (driveType) {
                case DriveItem.Network:
                    return "images/networkdrive.png";
                // case DriveItem.Removable:
                case DriveItem.Rom:
                    return "images/rom.png";
                default:
                    return "images/drive.png";
            }
        }
    }
    Drives.getItems = getItems;
})(Drives || (Drives = {}));
//# sourceMappingURL=Drives.js.map
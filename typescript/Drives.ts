
enum DriveItem {
    Unknown,
	HardDrive,
	Rom,
	Removable,
	Network
}

namespace Drives
{
	/**
	 * Abfrage der Laufwerke
	 * @param fileSystemAccess 
	 */
    export function getItems(fileSystemAccess: FileSystem): GetItemsOutput
    {
		var drives = fileSystemAccess.getDrives()
        return {
            currentDirectory: "drives",
            items: drives.map(drive => {
				return {
					name: drive.name,
					description: drive.description,
					fileSize: 12345,
					parent: null,
					kind: ItemsKind.Drive,
					imageUrl: getDriveIcon(drive.type)
				}
			})
		}
		// TODO: Registry, Dienste, History, Favoriten
		
		function getDriveIcon(driveType: DriveItem)
		{
			switch (driveType)
			{
				case DriveItem.Network:
					return "images/networkdrive.png"
				// case DriveItem.Removable:
				case DriveItem.Rom:
					return "images/rom.png"
				default:
					return "images/drive.png"
			}
		}
	}
}
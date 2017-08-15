
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
		var affe = fileSystemAccess.createAccess()
		var wällju = affe.getValue()
		alert(wällju)

		fileSystemAccess.getDrives(test => console.log(test))
		//var drives = fileSystemAccess.getDrives(test => alert(test))
        return null 
            // currentDirectory: "drives",
            // items: drives.map(drive => {
			// 	return {
			// 		name: drive.name,
			// 		description: drive.description,
			// 		fileSize: drive.size,
			// 		parent: null,
			// 		kind: ItemsKind.Drive,
			// 		imageUrl: getDriveIcon(drive.type)
			// 	}
			// }).concat([
		// 		[
		// 		{
		// 			name: "Registry",
		// 			description: "Windows Registrierungsdatenbank",
		// 			kind: ItemsKind.Drive,
		// 			parent: null,
		// 			fileSize: -1,
		// 			imageUrl: "images/registry.png"
		// 		},
		// 		{
		// 			name: "Dienste",
		// 			description: "Dienstesteuerung",
		// 			kind: ItemsKind.Drive,
		// 			parent: null,
		// 			fileSize: -1,
		// 			imageUrl: "images/service.png"
		// 		},
		// 		{
		// 			name: "History",
		// 			description: "Verlauf der Verzeichnisse",
		// 			kind: ItemsKind.Drive,
		// 			parent: null,
		// 			fileSize: -1,
		// 			imageUrl: "images/history.png"
		// 		},
		// 		{
		// 			name: "Favoriten",
		// 			description: "Abgespeicherte Verzeichnispfade",
		// 			kind: ItemsKind.Drive,
		// 			parent: null,
		// 			fileSize: -1,
		// 			imageUrl: "images/favorite.png"
		// 		}
		// 	]
		// }
		
		
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
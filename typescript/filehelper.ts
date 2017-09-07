/**
 * Funktionssammlung für die Darstellung von Item-Properties
 */
class FileHelper
{ 
    /**
     * Aus einem Dateinamen nur den Namesteil ohne Endung ermitteln
     * @param name
     */
    static getNameOnly(name:string): string {
        var pos = name.lastIndexOf('.');
        if (pos == -1)
            return name
        return name.substring(0, pos)
    }

    /**
     * Aus einem Dateinamen nur Die Endung ohne Namen ermitteln
     * @param name
     */
    static getExtension(name: string): string {
        var pos = name.lastIndexOf('.')
        if (pos == -1)
            return ""
        return name.substring(pos)
    }

    /**
     * Kombinieren von Pfaden
     * @param path1
     * @param path2
     */
    static pathCombine(path1: string, path2: string): string 
    {
        if (path1.charAt(path1.length - 1) == '\\')
            return path1 + path2
        return path1 + '\\' + path2
    }

    static getNameFromPath(path: string): string
    {
        var pos = path.lastIndexOf('\\')
        return path.substring(pos + 1)
    }

    static splitDirectory(directory: string)
    {
        const pos = directory.lastIndexOf('\\')
        let name = ""
        let path = ""
        if (pos != -1) {
            name = directory.substring(pos + 1)
            path = directory.substring(0, pos)
        }
        else
            name = directory
        return {
            name: name,
            path: path
        }
    }

    static formatFileSize(fileSize: number): string 
    {
        if (fileSize == -1)
            return ""
        var strNumber = `${fileSize}`
        var thSep = '.'
        if (strNumber.length > 3) {
            var begriff = strNumber
            strNumber = ""
            for (var j = 3; j < begriff.length; j += 3) {
                var extract = begriff.slice(begriff.length - j, begriff.length - j + 3)
                strNumber = thSep + extract + strNumber
            }
            var strfirst = begriff.substr(0, (begriff.length % 3 == 0) ? 3 : (begriff.length % 3))
            strNumber = strfirst + strNumber
        }
        return strNumber
    }

    static formatDate(dateString: string): string
    {
        var date = new Date(dateString)
        return FileHelper.dateFormat.format(date) + " " + FileHelper.timeFormat.format(date)
    }

    static compareVersion(versionLeft: string, versionRight: string): number
    {
        if (!versionLeft)
            return -1
        else if (!versionRight)
            return 1
        else
        {
            var leftParts = <number[]><any>versionLeft.split('.')
            var rightParts = <number[]><any>versionRight.split('.')
            if (leftParts[0] != rightParts[0])
                return <number>leftParts[0] - rightParts[0]
            else if (leftParts[1] != rightParts[1])
                return leftParts[1] - rightParts[1]
            else if (leftParts[2] != rightParts[2])
                return leftParts[2] - rightParts[2]
            else if (leftParts[3] != rightParts[3])
                return leftParts[3] - rightParts[3]
        }
        return 0
    }

    private static readonly dateFormat = Intl.DateTimeFormat("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
    private static readonly timeFormat = Intl.DateTimeFormat("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    })
}

export { FileHelper }
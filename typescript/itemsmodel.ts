enum ItemsKind {
    Drive,
    Parent,
    File,
    Directory,
    Service,
    Registry,
    RegistryProperty,
    Favorite,
    History,
    SavedView
}

/**
 * Das Itemsmodel, welches den Commander mit Daten versorgt
 */
class ItemsModel implements IModel
{
    /**
     * 
     * @param id Die ID des zugehörigen CommanderViews
     */
    constructor(id: string)
    {
        this.id = id
        this.fileSystemAccess = require('./plugins/filesystem') 
        Connection.addFileEventSource(this.id, this.update.bind(this))
        Connection.addServiceEventSource(this.id, this.updateServiceItem.bind(this))
    }

    /**
     * Registrierung eines Observables, welches über Änderungen im Model informiert werden möchte
     * @param observator
     */
    registerObservation(observator: IObservator) {
        this.observator = observator
    }

    /**
     * Ermittlung aller Einträge für das angegebene Verzeichnis
     * @param directory
     * @param lastCurrentDir das Verzeichnis, welches durch das neue ersetzt wird
     */
    async getItems(directory: string, lastCurrentDir: string) {
        this.observator.ItemsCleared()

        if (directory != this.CurrentDirectory)
            this.exifDates = null

        switch (directory)
        {
            case "Favoriten":
                this.currentItems = Favorites.getItems(lastCurrentDir)
                break
            case "History":
                this.currentItems = SavedHistory.getItems(lastCurrentDir)
                break
            case "SavedViews":
                this.currentItems = SavedViews.getItems(this.id, lastCurrentDir)
                break
            case "drives":
                this.currentItems = Drives.getItems(this.fileSystemAccess)
                break
            default:
                this.currentItems = await Connection.getItems(this.id, ++this.requestNumber, directory)
                if (this.exifDates)
                {
                    this.currentItems.items.forEach(n => 
                    {
                        if (this.exifDates[n.name])
                            n.exifDateTime = this.exifDates[n.name]
                    })
                }
                break
        }
            
        if (this.observator) {
            var lastCurrentIndex = 0;
            if (lastCurrentDir) {
                this.currentItems.items.forEach((item, index) => {
                    if ((item.kind == ItemsKind.Drive || item.kind == ItemsKind.Directory || item.kind == ItemsKind.Registry) && item.name == lastCurrentDir)
                        lastCurrentIndex = index
                })
            }
            this.observator.itemsChanged(lastCurrentIndex)
        }
    }

    /**
     * Rückgabe des Eintrages mit dem angegebenem Index
     * @param index
     */
    getItem(index: number): Item {
        if (index > this.currentItems.items.length)
            return null
        return this.currentItems.items[index]
    }

    /**
     * Ermittlung des originalen Einträge der Anwendung
     */
    getItemSource(): Item[] {
        return this.currentItems.items
    }

    /**
     * Ermittlung der selektierten Einträge
     */
    getSelectedItems(): Item[] {
        return this.currentItems.items.filter(item => {
            return item.selected
        })
    }

    /**
     * Wird von der Anwendung über WebSocket-Events aufgerufen, Dateiupdates
     * @param updateItems Array von ItemUpdate
     */
    update(updateItems: ItemUpdate[]) {
        var refresh = false
        updateItems.forEach(item => {
            if (item.version)
                this.currentItems.items[item.index].version = item.version
            if (item.dateTime)
            {
                this.currentItems.items[item.index].exifDateTime = item.dateTime
                if (!this.exifDates)
                    this.exifDates = {}
                this.exifDates[this.currentItems.items[item.index].name] = item.dateTime
            }
            refresh = true;
        })
        if (refresh && this.observator)
            this.observator.updateItems()
    }

    /**
     * Wird von der Anwendung über WebSocket-Events aufgerufen, ServiceStatusupdates
     * @param updateItems Array von ItemUpdate
     */
    updateServiceItem(updateItems: ServiceItemUpdate[]) {
        var refresh = false
        this.currentItems.items.forEach(item =>
        {
            var updateItem = updateItems.find(n => 
            {
                return item.serviceName == n.serviceName
            })
            if (updateItem)
            {
                item.status = updateItem.status
                item.imageUrl = updateItem.imageUrl;
                refresh = true
            }
        })
        if (refresh && this.observator)
            this.observator.updateItems()
    }

    /**
    * Das aktuelle Verzeichnis
    */
    get CurrentDirectory(): string {
        if (!this.currentItems)
            return null
        return this.currentItems.currentDirectory
    }

    /**
     * Ermittlung der Anzahl der Einträge
     */
    private getItemsCount(): number {
        return this.currentItems.items.length
    }

    private id: string

    /**
    * Das Element, welches über Änderungen benachrichtigt werden soll
    */
    private observator: IObservator
    /**
     * Die momentan angezeigten Items
     */
    private currentItems: GetItemsOutput

    /**
     * Jeder Request wird mit einer fortlaufenden Nummer versehen, damit die Updates zugeordnet werden können
     */
    private requestNumber = 0

    /**
    * Dictionary, in dem das Exif-Datum gespeichert ist, Schlüssel ist der Dateiname
    */
    private exifDates: { [name: string]: string } 

    /**
     * Zugriff auf das FileSystem über das Plugin 'filesystem' auf das  Windows API
     */
    private fileSystemAccess: FileSystem
}


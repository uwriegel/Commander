/**
 * Verbindung zur nativen Anwendung
 */
var Connection = (function () 
{ 
    var wsref = location.href.replace('http://', 'ws://')
    var url = `${wsref}Commander`
    var webSocket = new WebSocket(url)

    var itemUpdatesCallbacks: { [id: string]: (evt: ItemUpdate[]) => void } = {};
    var serviceItemsCallbacks: { [id: string]: (evt: ServiceItemUpdate[]) => void } = {}

    webSocket.onmessage = param =>
    {
        var evt = <CommanderEvent>JSON.parse(param.data)
        var id = evt.id
        if (evt.itemUpdates)
            itemUpdatesCallbacks[evt.id](evt.itemUpdates)
        if (evt.serviceItems) 
            serviceItemsCallbacks[evt.id](evt.serviceItems)
        if (evt.refresh)
            commanderInstance.getCommanderView(evt.id).refresh()
        if (evt.dragOver)
            commanderInstance.dragOver(evt.dragOver.x, evt.dragOver.y)
        if (evt.dragLeave)
            commanderInstance.dragLeave()
        if (evt.drop)
            commanderInstance.drop(evt.drop.x, evt.drop.y, evt.drop.dragDropKind, evt.drop.directory, evt.drop.items);
        if (evt.dragFinished)
            commanderInstance.getCommanderView(evt.dragFinished.commanderId).dragFinished(evt.dragFinished.refresh)
    }

    /**
     * Hinzufügen eines Eventhandlers für Dateiinfoupdates
     * @param id Die zugehörige ID
     * @param callback Rückruffunktion
     */
    function addFileEventSource(id, callback: (evt: ItemUpdate[]) => void) 
    {
        itemUpdatesCallbacks[id] = callback
    }

    /**
     * Hinzufügen eines Eventhandlers für Dienststatusänderungen
     * @param id Die zugehörige ID
     * @param callback Rückruffunktion
     */
    function addServiceEventSource(id, callback: (evt: ServiceItemUpdate[]) => void) 
    {
        serviceItemsCallbacks[id] = callback
    }

    /**
     * Ermittlung aller Einträge eines Verzeichnisses
     * @param id Die Id des zugehörigen Controls
     * @param requestNumber die eindeutige, fortlaufende Nummer der Abfrage
     * @param directory Das Verzeichnis, das abgefragt werden soll
     */
    function getItems(id: string, requestNumber: number, directory: string) 
    {
        var input =
        {
            id: id,
            requestNumber: requestNumber,
            directory: directory
        }
        return invoke<GetItemsOutput>("getItems", input)
    }

    function showHidden(show: boolean)
    {
        return invoke("showHidden", {
            show: show
        })
    }

    function startExplorer(directory: string)
    {
        return invoke("startExplorer", {
            directory: directory
        })
    }

    function checkFileOperation(operationData: IOperationData)
    {
        return invoke<OperationCheckResult>("checkFileOperation", operationData)
    }

    function createFolder(newName: string, directory: string) 
    {
        return invoke<OperationCheckResult>("createFolder",
            {
                newName: newName,
                directory: directory
            })
    }

    /**
     * Ausführen der laufenden Operation
     * @param ignoreConflicts Sollen Konfliktdateien ignoriert werden?
     */
    function runOperation(idsToRefresh: string[], ignoreConflicts?: boolean) 
    {
        return invoke("runOperation", { idsToRefresh: idsToRefresh, ignoreConflicts: ignoreConflicts })
    }

    /**
     * Abbruch der laufenden Operation
     */
    function cancel() 
    {
        return invoke("cancel")
    }

    /**
     * Starten von Diensten
     * @param Die Service-Items
     */
    function rename(oldName: string, newName: string, directory: string, makeCopy: boolean, idToRefresh: string) 
    {
        return invoke<OperationCheck>("rename", {
            oldName: oldName,
            newName: newName,
            directory: directory,
            makeCopy: makeCopy,
            idsToRefresh: [idToRefresh]
        })
    }

    function extendedRename(directory: string, items: Item[])
    {
        return invoke<OperationCheck>("extendedRename", {
            directory: directory,
            items: items
        })
    }

    function startDrag(commanderId: string, directory: string, items: Item[]) 
    {
        var input =
            {
                directory: directory,
                items: items,
                commanderId: commanderId
            }
        return invoke("startDrag", input)
    }

    function processItem(item: string, showProperties?: boolean, openWith?: boolean) 
    {
        return invoke("processItem", {
            file: item,
            openWith: openWith,
            showProperties: showProperties
        })
    }

    /**
     * Starten von Diensten
     * @param Die Service-Items
     */
    function startServices(services: Item[]) 
    {
        return invoke("startServices", services)
    }

    /**
     * Stoppen von Diensten
     * @param Die Service-Items
     */
    function stopServices(services: Item[]) 
    {
        return invoke("stopServices", services)
    }

    function invoke<T>(method: string, param?) {
        return new Promise<T>((resolve, reject) => {
            var xmlhttp = new XMLHttpRequest()
            xmlhttp.onload = evt => {
                var result = <T>JSON.parse(xmlhttp.responseText);
                resolve(result)
            }
            xmlhttp.open('POST', `Commander/${method}`, true)
            xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
            xmlhttp.send(JSON.stringify(param))
        })
    }

    return {
        addFileEventSource: addFileEventSource,
        addServiceEventSource: addServiceEventSource,
        getItems: getItems,
        showHidden: showHidden,
        startExplorer: startExplorer,
        checkFileOperation: checkFileOperation,
        createFolder: createFolder,
        runOperation: runOperation,
        rename: rename,
        cancel: cancel,
        startDrag: startDrag,
        processItem: processItem,
        startServices: startServices,
        stopServices: stopServices,
        extendedRename: extendedRename
    }
})()

enum OperationCheck
{
    OK,
    Cancelled,
    IdenticalDirectories,
    NoSelection,
    SubordinateDirectory,
    ServiceNotSupported,
    Incompatible,
    AlreadyExists,
    Unauthorized,
    CopyToFavorites
}

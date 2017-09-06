// /**
//  * Ein Commanderview besteht aus einer Tableview mit den Einträgen des aktuellen Verzeichnisses und einem Verzeichnis-Textfeldes
//  * @param id Die ID des CommanderViews
//  */
// class CommanderView
// {
//     get id()
//     {
//         return this._id
//     }
//     private _id
//      /**
//     * Das andere CommanderView
//     */
//     get otherView()
//     {
//         return this._otherView
//     }
//     set otherView(value: CommanderView)
//     {
//         this._otherView = value
//     }
//     private _otherView

//     get currentDirectory()
//     {
//         return this.itemsModel.CurrentDirectory
//     }

//     constructor(id: string)
//     {
//         this._id = id
//         this.parent = document.getElementById(id)
//         this.commanderDirectory = document.createElement("input")
//         this.commanderDirectory.classList.add('directory')
//         this.parent.appendChild(this.commanderDirectory)

//         var commanderTable = document.createElement('div')
//         commanderTable.classList.add('commanderTable')

//         this.parent.appendChild(commanderTable)
//         {
//             let restrictor = document.createElement('input')
//             restrictor.classList.add('restrictor')
//             restrictor.classList.add('restrictorHide')
//             this.parent.appendChild(restrictor)
//         }

//         this.tableView = new TableView(commanderTable)
//         this.itemsModel = new ItemsModel(id)
//         this.itemsSorter = new ItemsSorter(this.itemsModel)

//         this.columnsControl = new ColumnsControl([
//             {
//                 item: "Name",
//                 class: "",
//                 itemSortKind: ItemSortKind.Name
//             },
//             {
//                 item: "Erw.",
//                 class: "it-extension",
//                 itemSortKind: ItemSortKind.Extension
//             },
//             {
//                 item: "Größe",
//                 class: "it-size",
//                 itemSortKind: ItemSortKind.Size
//             },
//             {
//                 item: "Datum",
//                 class: "it-time",
//                 itemSortKind: ItemSortKind.Date
//             },
//             {
//                 item: "Version",
//                 class: "it-version",
//                 itemSortKind: ItemSortKind.Version
//             }], id + '-columns', this.itemsSorter)
//         this.drivesColumnControl = new ColumnsControl([
//             {
//                 item: "Name",
//                 class: "",
//                 itemSortKind: ItemSortKind.Name
//             },
//             {
//                 item: "Beschreibung",
//                 class: "it-description",
//                 itemSortKind: ItemSortKind.Description
//             },
//             {
//                 item: "Größe",
//                 class: "it-size",
//                 itemSortKind: ItemSortKind.Size
//             }], id + '-drivesColumns', this.itemsSorter)
//         this.favoritesColumnControl = new ColumnsControl([
//             {
//                 item: "Name",
//                 class: "",
//                 itemSortKind: ItemSortKind.Name
//             },
//             {
//                 item: "Beschreibung",
//                 class: "it-description",
//                 itemSortKind: ItemSortKind.Description
//             }], id + '-favoritesColumns', this.itemsSorter)
//         this.historyColumnControl = new ColumnsControl([
//             {
//                 item: "Name",
//                 class: "",
//                 itemSortKind: ItemSortKind.Name
//             },
//             {
//                 item: "Pfad",
//                 class: "it-path",
//                 itemSortKind: ItemSortKind.Description
//             }], id + '-historyColumns', this.itemsSorter)
//         this.serviceColumnsControl
//         this.registryColumnsControl

//         this.tableView.setObservable(this.itemsSorter)

//         var itemsViewModel = new ItemsViewModel(this.itemsSorter)
//         this.tableView.setItemsViewModel(itemsViewModel)
//         this.tableView.Columns = this.columnsControl

//         this.tableView.setOnSelectedCallback((i, o, sp) => this.processItem(i, o, sp))
//         this.tableView.setOnToggleSelection(i => this.itemsSorter.toggleSelection(i))
//         this.tableView.setOnDragCallback(() =>
//         {
//             var selectedItems = this.getSelectedItems()
//             if (selectedItems && selectedItems.length > 0)
//             {
//                 var currentItem = this.itemsSorter.getItem(this.tableView.getCurrentItemIndex())
//                 if (!selectedItems.find(n => n == currentItem))
//                 {
//                     this.itemsSorter.toggleSelection(this.tableView.getCurrentItemIndex())
//                     selectedItems = this.getSelectedItems()
//                 }
//                 this.dragStarted = true
//                 Connection.startDrag(this.id, this.currentDirectory, selectedItems)
//             }
//         })

//         this.commanderDirectory.onfocus = () =>
//         {
//             this.commanderDirectory.select()
//         }

//         this.commanderDirectory.onkeydown = e =>
//         {
//             switch (e.which)
//             {
//                 case 13: // Enter
//                     if (e.altKey)
//                         Connection.processItem(FileHelper.pathCombine(this.itemsModel.CurrentDirectory, this.commanderDirectory.value), true)
//                     else
//                     {
//                         this.changeDirectory(this.commanderDirectory.value)
//                         this.tableView.focus()
//                     }
//                     break;
//             }
//         }

//         this.tableView.setOnCurrentItemChanged(item =>
//         {
//             if (this.onCurrentItemChanged)
//             {
//                 if (!item)
//                     this.onCurrentItemChanged()
//                 else
//                     this.onCurrentItemChanged(this.itemsSorter.getItem(item), this.itemsModel.CurrentDirectory)
//             }
//         })

//         commanderTable.onkeypress = e =>
//         {
//             this.keysRestrict(e)
//         }

//         commanderTable.onkeydown = e =>
//         {
//             switch (e.which)
//             {
//                 case 8: // BACKSPACE
//                     if (this.restrictor != null)
//                     {
//                         this.restrictBack()
//                         e.preventDefault()
//                         return
//                     }
//                     this.changeDirectory("History")
//                     e.preventDefault()
//                     break
//                 case 27: // ESC
//                     if (this.restrictor)
//                         this.closeRestrict()
//                     else
//                         this.itemsSorter.selectAll(false)
//                     break
//                 case 32: // _
//                     if (this.restrictor == null)
//                         this.itemsSorter.toggleSelection(this.tableView.getCurrentItemIndex())
//                     break
//                 case 35: // End
//                     if (e.shiftKey)
//                     {
//                         this.itemsSorter.selectAll(true, this.tableView.getCurrentItemIndex())
//                         e.preventDefault()
//                     }
//                     break
//                 case 36: // Pos1
//                     if (e.shiftKey)
//                     {
//                         this.itemsSorter.selectAll(false, this.tableView.getCurrentItemIndex() + 1)
//                         e.preventDefault();
//                     }
//                     break;
//                 case 45: // Einfg
//                     var itemIndex = this.tableView.getCurrentItemIndex()
//                     this.itemsSorter.toggleSelection(this.tableView.getCurrentItemIndex())
//                     this.tableView.downOne()
//                     break
//                 case 46: // DEL
//                     this.executeDelete()
//                     break
//                 case 69: // e
//                     if (e.ctrlKey)
//                     {
//                         e.preventDefault()
//                         Connection.startExplorer(this.currentDirectory)
//                     }
//                     break
//                 case 82: // r
//                     if (e.ctrlKey)
//                     {
//                         this.refresh()
//                         e.preventDefault()
//                     }
//                     break
//                 case 107: // NUM +
//                     this.selectAll()
//                     break
//                 case 109: // NUM -
//                     this.selectNone()
//                     break
//                 case 112: // F1
//                     if (!e.ctrlKey)
//                     {
//                         this.changeDirectory("Favoriten")
//                         e.preventDefault()
//                     }
//                     break
//                 case 113: // F2
//                     this.executeRename(e.ctrlKey)
//                     break;
//                 case 116: // F5
//                     this.executeCopy()
//                     break
//                 case 117: // F6
//                     this.executeMove()
//                     break
//                 case 118: // F7
//                     this.createDirectory()
//                     break
//                 case 120: // F9
//                     this.otherView.changeDirectory(this.currentDirectory)
//                     break
//             }
//         }
//     }

//     initialize()
//     {
//         var currentDirectory = localStorage[this.id]
//         if (!currentDirectory)
//             currentDirectory = "root"
//         this.changeDirectory(currentDirectory)
//     }

//     focus()
//     {
//         this.tableView.focus()
//     }

//     focusDirectoryInput()
//     {
//         this.commanderDirectory.focus()
//     }

//     isDirectoryInputFocused()
//     {
//         return this.commanderDirectory.contains(document.activeElement)
//     }

//     setOnFocus(callback: () => void)
//     {
//         this.tableView.setOnFocus(() => callback())
//     }

//     changeDirectory(directory: string)
//     {
//         if (this.historyWriterTimeouter)
//         {
//             clearTimeout(this.historyWriterTimeouter)
//             this.historyWriterTimeouter = null
//         }

//         this.closeRestrict(true)

//         var historyDirectory
//         switch (directory)
//         {
//             case "root":
//                 if (this.tableView.Columns != this.drivesColumnControl)
//                     this.tableView.Columns = this.drivesColumnControl
//                 break;
//             case "Favoriten":
//                 if (this.tableView.Columns != this.favoritesColumnControl)
//                     this.tableView.Columns = this.favoritesColumnControl
//                 break;
//             case "History":
//                 if (this.tableView.Columns != this.historyColumnControl)
//                     this.tableView.Columns = this.historyColumnControl
//                 this.lastCurrentDir = this.currentDirectory
//                 break;
//             case "SavedViews":
//                 if (this.tableView.Columns != this.historyColumnControl)
//                     this.tableView.Columns = this.historyColumnControl
//                 this.lastCurrentDir = this.currentDirectory
//                 break;
//             case "Dienste":
//                 if (this.tableView.Columns != this.serviceColumnsControl)
//                 {
//                     this.serviceColumnsControl = new ColumnsControl([
//                         {
//                             item: "Name",
//                             class: "",
//                             itemSortKind: ItemSortKind.Name
//                         },
//                         {
//                             item: "Status",
//                             class: "it-status",
//                             itemSortKind: ItemSortKind.ServiceItemStatus
//                         },
//                         {
//                             item: "Startart",
//                             class: "it-startType",
//                             itemSortKind: ItemSortKind.ServiceItemStartKind
//                         }], `${this.id}-serviceColumns`, this.itemsSorter)
//                     this.tableView.Columns = this.serviceColumnsControl
//                 }
//                 break;
//             default:
//                 if (directory == "Registry" || directory.startsWith("HKEY_"))
//                 {
//                     if (this.tableView.Columns != this.registryColumnsControl)
//                     {
//                         this.registryColumnsControl = new ColumnsControl([
//                             {
//                                 item: "Name",
//                                 class: "",
//                                 itemSortKind: ItemSortKind.Name
//                             },
//                             {
//                                 item: "Wert",
//                                 class: "it-value",
//                                 itemSortKind: ItemSortKind.RegistryValue
//                             }], `${this.id}--registryColumns`, this.itemsSorter)
//                         this.tableView.Columns = this.registryColumnsControl
//                     }
//                 }
//                 else
//                 {
//                     if (this.extendedRename)
//                     {
//                         if (this.tableView.Columns != this.extendedRename.Columns)
//                             this.tableView.Columns = this.extendedRename.Columns
//                     }
//                     else
//                     {
//                         if (this.tableView.Columns != this.columnsControl)
//                             this.tableView.Columns = this.columnsControl
//                     }
//                 }
//                 if (!directory.endsWith(':\\'))
//                     historyDirectory = directory
//                 break;
//         }

//         localStorage[this.id] = directory
//         this.itemsModel.getItems(directory, this.lastCurrentDir)
//         this.commanderDirectory.value = directory

//         if (historyDirectory)
//         {
//             this.historyWriterTimeouter = setTimeout(() =>
//             {
//                 SavedHistory.saveHistory(historyDirectory)
//             }, 6000)
//         }
//     }

//     refresh()
//     {
//         this.changeDirectory(this.currentDirectory)
//     }

//     setOnCurrentItemChanged(callback: (item: Item, directory: string) => void)
//     {
//         this.onCurrentItemChanged = callback
//     }

//     changeSavedView(index: number)
//     {
//         this.processItem(index, false, false, true)
//     }

//     isMouseInTableView(x: number, y: number): boolean
//     {
//         if (!this.dragStarted)
//             return this.tableView.isMouseWithin(x, y)
//         else
//             return false;
//     }

//     dragLeave()
//     {
//         this.tableView.dragLeave()
//     }

//     drop(dragDropKind: DragDropKind, directory: string, items: Item[])
//     {
//         if (dragDropKind == DragDropKind.Link)
//         {
//             alert("Unterstützte ich nicht!");
//             return;
//         }

//         var u = directory
//         this.processOperation(items,
//             n => dragDropKind == DragDropKind.Copy ? this.getDropCopyOperationData(directory, n) : this.getDropMoveOperationData(directory, n), 
//             (result: OperationCheckResult) => {
//                 this.operateFile(result, `Möchtest Du die ausgewählten Dateien ${dragDropKind == DragDropKind.Copy ? 'kopieren' : 'verschieben'}?`,
//                     directory == this.currentDirectory ? true : false)
//         })
//     }

//     dragFinished(refresh: boolean)
//     {
//         this.dragStarted = false
//         if (refresh)
//             this.refresh()
//     }

//     async executeRename(ctrlKey: boolean)
//     {
//         if (ctrlKey)
//         {
//             Dialog.initialize("Erweitertes Umbenennen")
//             this.extendedRename = null
//             this.itemsSorter.RegisterSelectionChange(null)

//             var extendedRename = Dialog.addExtendedRename(this.itemsSorter, this.tableView)
//             Dialog.setOkCancel(dialogResult =>
//             {
//                 if (dialogResult == DialogResult.OK)
//                 {
//                     this.extendedRename = extendedRename
//                     this.itemsSorter.RegisterSelectionChange(this.extendedRename)

//                     this.extendedRename.Columns = new ColumnsControl([
//                         {
//                             item: "Name",
//                             class: "",
//                             itemSortKind: ItemSortKind.Name
//                         },
//                         {
//                             item: "Neu",
//                             class: "it-new",
//                             itemSortKind: ItemSortKind.Date
//                         },
//                         {
//                             item: "Erw.",
//                             class: "it-extension",
//                             itemSortKind: ItemSortKind.Extension
//                         },
//                         {
//                             item: "Größe",
//                             class: "it-size",
//                             itemSortKind: ItemSortKind.Size
//                         },
//                         {
//                             item: "Datum",
//                             class: "it-time",
//                             itemSortKind: ItemSortKind.Date
//                         }], this.id + '-columns', this.itemsSorter)
//                 }
//                 this.refresh();
//             })
//             Dialog.show()
//         }
//         else
//         {
//             if (this.extendedRename)
//             {
//                 var result = await this.extendedRename.execute(this.itemsModel.CurrentDirectory, this.itemsModel.getSelectedItems())
//                 switch (result)
//                 {
//                     case OperationCheck.OK:
//                         this.refresh()
//                         break
//                     case OperationCheck.Cancelled:
//                         Dialog.initialize("Abgebrochen")
//                         Dialog.show()
//                         break
//                 }
//             }
//             else
//             {
//                 var currentIndex = this.tableView.getCurrentItemIndex()
//                 var item = <Item>this.itemsSorter.getItem(currentIndex)
//                 if (item.kind == ItemsKind.Directory || item.kind == ItemsKind.File || item.kind == ItemsKind.Favorite)
//                 {
//                     var count
//                     if (item.kind == ItemsKind.File)
//                     {
//                         var name = FileHelper.getNameOnly(item.name)
//                         count = name.length
//                     }
//                     this.rename(item, count)
//                 }
//             }
//         }
//     }

//     executeCopy()
//     {
//         this.processOperation(null, n => this.getCopyOperationData(n), (result: OperationCheckResult) =>
//         {
//             this.operateFile(result, "Möchtest Du die ausgewählten Dateien kopieren?", false)
//         })
//     }

//     executeMove()
//     {
//         this.processOperation(null, n => this.getMoveOperationData(n), (result: OperationCheckResult) =>
//         {
//             this.operateFile(result, "Möchtest Du die ausgewählten Dateien verschieben?", true)
//         })
//     }

//     executeDelete()
//     {
//         this.processOperation(null, n => this.getDeleteOperationData(n), r => this.operateDelete(r))
//     }

//     executeShowProperties()
//     {
//         var item = this.tableView.getCurrentItemIndex()
//         if (item)
//             this.processItem(item, false, true)
//     }

//     gotoFirst()
//     {
//         this.tableView.pos1()
//     }

//     showFavorites()
//     {
//         this.changeDirectory("Favoriten")
//     }

//     selectAll()
//     {
//         this.itemsSorter.selectAll(true)
//     }

//     selectNone()
//     {
//         this.itemsSorter.selectAll(false)
//     }

//     private processItem(itemIndex: number, openWith: boolean, showProperties: boolean, fromOtherView?: boolean)
//     {
//         var dir: string
//         this.lastCurrentDir = null
//         var item = <Item>this.itemsSorter.getItem(itemIndex)
//         var selectedItems = this.itemsModel.getSelectedItems()

//         if (selectedItems.length == 0 || (selectedItems[0].kind != ItemsKind.Service || item.kind == ItemsKind.Parent))
//         {
//             switch (item.kind)
//             {
//                 case ItemsKind.Drive:
//                     if (showProperties)
//                     {
//                         Connection.processItem(item.name, true)
//                         return
//                     }
//                     dir = item.name
//                     this.recentDirectories.push(dir)
//                     break
//                 case ItemsKind.Parent:
//                     dir = item.parent
//                     this.lastCurrentDir = this.recentDirectories.pop()
//                     if (item.savedViewParent && !fromOtherView)
//                         this.otherView.changeSavedView(0)
//                     break
//                 case ItemsKind.Directory:
//                     if (showProperties)
//                     {
//                         Connection.processItem(FileHelper.pathCombine(this.itemsModel.CurrentDirectory, item.name), true)
//                         return
//                     }
//                     dir = FileHelper.pathCombine(this.itemsModel.CurrentDirectory, item.name)
//                     this.recentDirectories.push(item.name)
//                     break
//                 case ItemsKind.File:
//                     Connection.processItem(FileHelper.pathCombine(this.itemsModel.CurrentDirectory, item.name), showProperties, openWith)
//                     return
//                 case ItemsKind.Favorite:
//                     dir = FileHelper.pathCombine(item.parent, item.favoriteTarget)
//                     this.recentDirectories.push(item.favoriteTarget)
//                     break
//                 case ItemsKind.History:
//                     dir = item.favoriteTarget
//                     break
//                 case ItemsKind.SavedView:
//                     dir = item.favoriteTarget
//                     if (!fromOtherView)
//                         this.otherView.changeSavedView(this.tableView.getCurrentItemIndex())
//                     break
//                 case ItemsKind.Service:
//                     var selItems = [];
//                     selItems.push(item);
//                     Connection.startServices(selItems)
//                     return
//                 case ItemsKind.Registry:
//                     dir = FileHelper.pathCombine(this.itemsModel.CurrentDirectory, item.name)
//                     this.recentDirectories.push(item.name)
//                     break
//                 default:
//                     return
//             }
//         }
//         else
//             Connection.startServices(selectedItems)

//         this.changeDirectory(dir)
//         this.tableView.focus()
//     }

//     private keysRestrict(e)
//     {
//         var restrict = String.fromCharCode(e.charCode).toLowerCase()
//         if (this.restrictor != null)
//             restrict = this.restrictor.value + restrict

//         if (this.itemsSorter.restrict(restrict))
//             this.checkRestrict(restrict)
//         if (!this.tableView.focus())
//             this.tableView.pos1()

//     }

//     private checkRestrict(restrict)
//     {
//         if (this.restrictor == null)
//         {
//             this.restrictor = <HTMLInputElement>this.parent.getElementsByClassName("restrictor")[0]
//             this.restrictor.classList.remove('restrictorHide')
//         }
//         this.restrictor.value = restrict
//     }

//     private closeRestrict(noRefresh?: boolean)
//     {
//         if (this.restrictor)
//         {
//             this.restrictor.classList.add('restrictorHide')
//             this.restrictor = null
//             this.itemsSorter.closeRestrict(noRefresh)
//             this.tableView.focus()
//         }
//     }

//     private restrictBack()
//     {
//         var restrict = this.restrictor.value
//         restrict = restrict.substring(0, restrict.length - 1)
//         if (restrict.length == 0)
//             this.closeRestrict()
//         else
//         {
//             if (this.itemsSorter.restrict(restrict, true))
//                 this.checkRestrict(restrict)
//             this.tableView.focus()
//         }
//     }

//     private async processOperation(dropSelection: Item[], getOperationData: (items: Item[]) => IOperationData, operate: (result: OperationCheckResult) => void)
//     {
//         var selection = dropSelection ? dropSelection : this.getSelectedItems()
//         if (!selection.length)
//             return

//         switch (this.currentDirectory)
//         {
//             case "SavedViews":
//                 Dialog.initialize("Möchtest Du diese gespeicherte Ansicht löschen?")
//                 Dialog.setOkCancel(dialogResult =>
//                 {
//                     if (dialogResult == DialogResult.OK)
//                     {
//                         SavedViews.deleteItem(this.tableView.getCurrentItemIndex())
//                         this.refresh()
//                         this.otherView.refresh()
//                     }
//                 })
//                 Dialog.show()
//                 return
//             case "Favoriten":
//                 Dialog.initialize("Möchtest Du diesen Favoriten löschen?")
//                 Dialog.setOkCancel(dialogResult =>
//                 {
//                     if (dialogResult == DialogResult.OK)
//                     {
//                         Favorites.deleteItems(selection)
//                         this.refresh()
//                     }
//                 })
//                 Dialog.show()
//                 return
//             default:
//                 break
//         }

//         WaitingItem.start(15, isCancelled =>
//         {
//             WaitingItem.stop(!isCancelled)
//             Connection.cancel()
//             if (!isCancelled)
//             {
//                 Dialog.initialize("Dauert zu lange")
//                 Dialog.show()
//             }
//         })

//         var operationData = getOperationData(selection)
//         var result = await Connection.checkFileOperation(operationData)
//         WaitingItem.stop(true)
//         switch (result.result)
//         {
//             case OperationCheck.OK:
//                 operate(result)
//                 break;
//             case OperationCheck.Cancelled:
//                 break;
//             case OperationCheck.IdenticalDirectories:
//                 Dialog.initialize("Die Verzeichnisse sind identisch")
//                 Dialog.show()
//                 break
//             case OperationCheck.NoSelection:
//                 Dialog.initialize("Für diese Operation sind keine gültigen Elemente ausgewählt")
//                 Dialog.show()
//                 break
//             case OperationCheck.SubordinateDirectory:
//                 Dialog.initialize("Der Zielordner ist dem Quellordner untergeordnet")
//                 Dialog.show()
//             case OperationCheck.Incompatible:
//                 Dialog.initialize("Du kannst diese Elemente nicht in diesen Zielordner kopieren/verschieben")
//                 Dialog.show()
//             case OperationCheck.ServiceNotSupported:
//                 if (operationData.operation == "delete")
//                     Connection.stopServices(selection)
//                 break;
//             case OperationCheck.CopyToFavorites:
//                 Favorites.addItem(operationData.sourceDir, operationData.items[0].name)
//                 this.otherView.refresh()
//                 break;
//         }
//     }

//     private getSelectedItems()
//     {
//         /// <summary>gibt den aktuellen Eintrag zurück, oder die selektierten</summary>
//         var items = this.itemsModel.getSelectedItems()
//         if (items.length == 0)
//         {
//             items = []
//             items.push(this.itemsSorter.getItem(this.tableView.getCurrentItemIndex()))
//         }
//         return items
//     }

//     private getCopyOperationData(selection: Item[]): IOperationData
//     {
//         return {
//             operation: "copy",
//             sourceDir: this.currentDirectory,
//             targetDir: this.otherView.currentDirectory,
//             items: selection
//         }
//     }

//     private getMoveOperationData(selection: Item[]): IOperationData
//     {
//         return {
//             operation: "move",
//             sourceDir: this.currentDirectory,
//             targetDir: this.otherView.currentDirectory,
//             items: selection
//         }
//     }

//     private getDropCopyOperationData(sourceDir: string, selection: Item[]): IOperationData {
//         return {
//             operation: "copy",
//             sourceDir: sourceDir,
//             targetDir: this.otherView.currentDirectory,
//             items: selection
//         }
//     }
    
//     private getDropMoveOperationData(sourceDir: string, selection: Item[]): IOperationData {
//         return {
//             operation: "move",
//             sourceDir: sourceDir,
//             targetDir: this.otherView.currentDirectory,
//             items: selection
//         }
//     }

//     private getDeleteOperationData(selection)
//     {
//         return {
//             operation: "delete",
//             sourceDir: this.currentDirectory,
//             items: selection
//         }
//     }

//     private operateDelete(result: OperationCheckResult)
//     {
//         Dialog.initialize("Möchtest Du die ausgewählten Dateien löschen?")
//         Dialog.setOkCancel(dialogResult => 
//         {
//             if (dialogResult == DialogResult.OK)
//                 Connection.runOperation([this.id])
//         })
//         Dialog.show()
//     }

//     private operateFile(result: OperationCheckResult, question: string, refreshTarget: boolean)
//     {
//         if (result.result == OperationCheck.Incompatible)
//         {
//             Dialog.initialize("Du kannst die ausgewählten Elemente nicht in diesen Zielordner kopieren")
//             Dialog.show()
//         }
//         else if (result.conflictItems.length > 0)
//         {
//             Dialog.initialize("Folgende Dateien überschreiben?")
//             Dialog.addConflictView(result)
//             Dialog.setYesNoCancel(async dialogResult =>
//             {
//                 if (dialogResult != DialogResult.Cancel)
//                 {
//                     var idsToRefresh = [this.otherView.id]
//                     if (refreshTarget)
//                         idsToRefresh.push(this.id)
//                     Connection.runOperation(idsToRefresh, dialogResult == DialogResult.OK)
//                 }
//             })
//             Dialog.show()
//         }
//         else
//         {
//             if (result.exception == "ToFavorites")
//                 question = "Möchtest Du die ausgewählten Ordner als Favoriten hinzufügen?"
//             Dialog.initialize(question)
//             Dialog.setOkCancel(dialogResult =>
//             {
//                 if (dialogResult == DialogResult.OK)
//                 {
//                     var idsToRefresh = [this.otherView.id]
//                     if (refreshTarget)
//                         idsToRefresh.push(this.id)
//                     Connection.runOperation(idsToRefresh)
//                 }
//             });
//             Dialog.show()
//         }
//     }

//     private createDirectory()
//     {
//         var input = "Neuer Ordner"
//         var selectedItems = this.getSelectedItems()
//         if (selectedItems.length == 1 && selectedItems[0].kind == ItemsKind.Directory)
//             input = selectedItems[0].name

//         Dialog.initialize("Neuen Ordner anlegen:")
//         Dialog.setInput(input)
//         Dialog.setOkCancel(dialogResult =>
//         {
//             if (dialogResult == DialogResult.OK)
//                 this.createFolder(Dialog.text)
//         })
//         Dialog.show()
//     }

//     private async createFolder(newName: string)
//     {
//         var result = await Connection.createFolder(newName, this.currentDirectory)
//         switch (result.result)
//         {
//             case OperationCheck.OK:
//                 this.refresh()
//                 break;
//             case OperationCheck.Incompatible:
//                 Dialog.initialize("Du kannst hier keinen neuen Ordner anlegen!")
//                 Dialog.show()
//                 break
//             case OperationCheck.AlreadyExists:
//                 Dialog.initialize("Der Ordner ist doch schon da!")
//                 Dialog.show()
//                 break
//             case OperationCheck.Unauthorized:
//                 Dialog.initialize("Du hast kein Recht hier einen Ordner anzulegen!")
//                 Dialog.show()
//                 break;
//             default:
//                 Dialog.initialize("Die Aktion konnte nicht durchgeführt werden!")
//                 Dialog.show()
//                 break;
//         }
//     }

//     /**
//      * Umbenennen eines Eintrages
//      * @param item Der umzubennende Eintrag
//      * @param selectionCount wenn angegeben, werden nur die Anzahl der Zeichen selektiert (Bei Dateien: nur der Name, nicht die Erweiterung
//      */
//     private rename(item: Item, selectionCount: number)
//     {
//         Dialog.initialize("Umbennenen:")
//         Dialog.setInput(item.name, selectionCount)
//         Dialog.setCheckBox("Kopie anlegen")
//         Dialog.setOkCancel(async dialogResult =>
//         {
//             if (dialogResult == DialogResult.OK)
//             {
//                 var result = await Connection.rename(item.name, Dialog.text, this.currentDirectory, Dialog.isChecked, this.id)
//                 switch (result)
//                 {
//                     case OperationCheck.AlreadyExists:
//                         Dialog.initialize("Du kannst hier keinen neuen Ordner anlegen!")
//                         Dialog.show()
//                         break
//                     case OperationCheck.CopyToFavorites:
//                         Favorites.renameItem(item.parent, item.name, Dialog.text)
//                         this.refresh()
//                         break
//                     case OperationCheck.OK:
//                         this.refresh()
//                         break
//                 }
//             }
//         })
//         Dialog.show()
//     }

//     private tableView: TableView
//     private parent: HTMLElement  
//     private itemsModel: ItemsModel
//     private itemsSorter: ItemsSorter
//     /**
//     * Das input-Element, welches die Beschränkungszeichen darstellt</var>
//     */
//     private restrictor: HTMLInputElement
//     /**
//     * Das Eingabefeld zur Eingabe eines Verzeichnisses
//     */
//     private commanderDirectory: HTMLInputElement
//     private onCurrentItemChanged: (item?: Item, directory?: string) => void
//     private columnsControl: ColumnsControl
//     private drivesColumnControl: ColumnsControl
//     private favoritesColumnControl: ColumnsControl
//     private historyColumnControl: ColumnsControl
//     private serviceColumnsControl: ColumnsControl
//     private registryColumnsControl: ColumnsControl
//     private lastCurrentDir: string
//     private recentDirectories: string[] = []
//     private historyWriterTimeouter: NodeJS.Timer
//     private extendedRename: ExtendedRename
//     private dragStarted: boolean
// }

enum DragDropKind
{
    Copy,
    Move,
    Link
}






    

        
 
 
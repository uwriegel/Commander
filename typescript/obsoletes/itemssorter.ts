// import { IModel, Item, ItemsModel, ItemsKind }  from './itemsmodel'
// import { FileHelper }  from './filehelper'
// import { Presenter }  from './presenter'

// interface ISorter
// {
//     sort(columnIndex: ItemSortKind, ascending: boolean, preserveCurrentItem: boolean): void
// }

// enum ItemSortKind 
// {
//     Name,
//     Extension,
//     Description,
//     Size,
//     Date,
//     Version,
//     ServiceItemStatus,
//     ServiceItemStartKind,
//     RegistryValue
// }

// /**
//  * Der Sortierer befindet sich zwischen ItemsModel und ItemsViewModel und ist für das Sortieren der Einträge zuständig
//  * @param itemsModelToSet Das zugehörige ItemsModel
//  */
// class ItemsSorter implements View, IModel, ISorter
// {
//     constructor(private itemsModel: ItemsModel)
//     {
//         this.itemsModel.registerObservation(this)
//     }

//     RegisterSelectionChange(selectionChanged: ISelectionChanged)
//     {
//         this.selectionChanged = selectionChanged
//     }

//     getItemSource()
//     {
//         return this.itemsToShow
//     }
    
//     /**
//      * Ermittlung des Eintrags mit dem angegebenen Index
//      * @param index Der Index des gewünschten Eintrages
//      */
//     getItem(index: number): Item | null
//     {
//         if (!this.itemsToShow || index > this.itemsToShow.length)
//             return null
//         return this.itemsToShow[index]
//     }

//     getSelectedItems()
//     {
//         return this.itemsToShow.filter(item => item.selected)
//     }

//     sort(itemSortKind: ItemSortKind, ascending: boolean, preserveCurrentItem: boolean) {
//         this.itemSortKind = itemSortKind
//         this.ascending = ascending
//         let newCurrentIndex = 0
//         var currentItem: Item
//         if (preserveCurrentItem) {
//             var currentItemIndex = this.observator.getCurrentItemIndex()
//             var currentItem = <Item>this.getItem(currentItemIndex)
//             if (currentItem.kind == ItemsKind.Drive || currentItem.kind == ItemsKind.Directory || currentItem.kind == ItemsKind.Registry || currentItem.kind == ItemsKind.Parent)
//                 newCurrentIndex = currentItemIndex
//         }
//         //sortItems(preserveCurrentItem)
//         this.sortItems()
//         if (preserveCurrentItem && !newCurrentIndex) {
//             this.itemsToShow.forEach((item, i) => {
//                 if (item.name == currentItem.name)
//                     newCurrentIndex = i
//             })
//         }

//         if (this.observator)
//             this.observator.itemsChanged(newCurrentIndex)
//         if (this.selectionChanged)
//             this.selectionChanged.selectionChanged()
//     }



//     /**
//      * Die Selektion invertieren
//      * @param itemIndex Der index des Eintrages, dessen Selektionsstatus invertiert werden soll
//      */
//     toggleSelection(itemIndex: number)
//     {
//         if (!this.canBeSelected(itemIndex))
//             return

//         if (this.itemsToShow[itemIndex].selected)
//             this.itemsToShow[itemIndex].selected = false
//         else
//             this.itemsToShow[itemIndex].selected = true

//         this.observator.refreshSelection(itemIndex, this.itemsToShow[itemIndex] ? true : false)
//         if (this.selectionChanged)
//             this.selectionChanged.selectionChanged()
//     }        

//     /**
//      * Alles selektieren
//      * @param select Soll selektiert werden, oder deselektiert?
//      * @param startIndex Index, ab dem angefangen werden soll
//      */
//     selectAll(select: boolean, startIndex?: number) {
//         this.itemsToShow.forEach((item, index) => {
//             if (this.canBeSelected(index)) {
//                 if (!startIndex || index >= startIndex)
//                     this.itemsToShow[index].selected = select
//                 else
//                     this.itemsToShow[index].selected = !select
//             }
//         })
//         this.observator.updateItems()
//         if (this.selectionChanged)
//             this.selectionChanged.selectionChanged()
//     }

//     /**
//      * Einträge wurden entfernt
//      */
//     ItemsCleared() {
//         if (this.observator) {
//             this.observator.ItemsCleared()
//         }
//     }

//     /**
//      * Die Einträge haben sich geändert
//      * @param lastCurrentIndex Der Index des aktuellen Eintrages vor der Änderung
//      */
//     itemsChanged(lastCurrentIndex: number) {
//         this.items = this.itemsModel.getItemSource()
//         this.itemsToShow = this.items
//         if (this.itemSortKind)
//             this.sortItems()
//         if (this.observator)
//             this.observator.itemsChanged(lastCurrentIndex)
//     }

//     /**
//      * Einträge aktualisieren
//      */
//     updateItems() {
//         if (this.observator)
//             this.observator.updateItems()
//     }

//     /**
//      * 
//      * @param itemIndex
//      * @param isSelected
//      */
//     refreshSelection(itemIndex: number, isSelected: boolean) {
//         if (this.observator)
//             this.observator.refreshSelection(itemIndex, isSelected)
//         if (this.selectionChanged)
//             this.selectionChanged.selectionChanged()
//     }

//     /**
//      * Ist komplett ohne Implementierung!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//      */
//     getCurrentItemIndex(): number 
//     {
//         // TODO:
//         return 0
//     }

//     /**
//      * Registrierung eines Observables, welches über Änderungen im Model informiert werden möchte
//      * @param observator
//      */
//     registerView(observator: IView) {
//         this.observator = observator
//     }

//     /**
//      * Rückgabe der Anzahl der Einträge
//      */    
//     getItemsCount() {
//         return this.itemsToShow.length
//     }

//     private sortItems() {
//         var sorted = []
//         var fileItem
//         var restArray = null
//         for (var i = 0; i < this.itemsToShow.length; i++) {

//             var its = <Item>this.itemsToShow[i]


//             if (its.kind == ItemsKind.Parent || its.kind == ItemsKind.Drive || its.kind == ItemsKind.Directory || its.kind == ItemsKind.Registry)
//                 sorted.push(this.itemsToShow[i])
//             else {
//                 fileItem = its.kind == ItemsKind.File || its.kind == ItemsKind.Service || its.kind == ItemsKind.RegistryProperty
//                 restArray = this.itemsToShow.slice(i)
//                 break
//             }
//         }

//         if (restArray) {
//             if (fileItem) {
//                 switch (this.itemSortKind) {
//                     case ItemSortKind.Name :
//                         this.sortFileItemName(restArray)
//                         break
//                     case ItemSortKind.Extension:
//                         this.sortFileItemExt(restArray)
//                         break
//                     case ItemSortKind.Size:
//                         this.sortFileItemSize(restArray)
//                         break
//                     case ItemSortKind.Date:
//                         this.sortFileItemDate(restArray)
//                         break
//                     case ItemSortKind.Version:
//                         this.sortFileItemVersion(restArray)
//                         break
//                     case ItemSortKind.ServiceItemStatus:
//                         this.sortServiceItemStatus(restArray)
//                         break
//                     case ItemSortKind.ServiceItemStartKind:
//                         this.sortServiceItemStartKind(restArray)
//                         break
//                     case ItemSortKind.RegistryValue:
//                         this.sortRegistryValue(restArray)
//                         break
//                 }
//             }
//             this.itemsToShow = sorted.concat(restArray)
//         }
//     }

//     private sortFileItemName(restArray: Item[]) {
//         restArray.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             var result = FileHelper.getNameOnly(a.name).localeCompare(FileHelper.getNameOnly(b.name))
//             return this.ascending ? result : -result
//         })
//     }

//     private sortFileItemExt(restArray: Item[]) {
//         restArray.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             var result = FileHelper.getExtension(a.name).localeCompare(FileHelper.getExtension(b.name))
//             return this.ascending ? result : -result
//         })
//     }

//     private sortFileItemSize(restArray: Item[]) {
//         restArray.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             var result = a.fileSize - b.fileSize
//             return this.ascending ? result : -result
//         })
//     }

//     private sortFileItemDate(restArray: Item[]) {
//         restArray.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             const date1 = a.exifDateTime ? a.exifDateTime : a.dateTime
//             const date2 = b.exifDateTime ? b.exifDateTime : b.dateTime
//             const result = date1!.localeCompare(date2!)
//             return this.ascending ? result : -result
//         })
//     }

//     private sortFileItemVersion(items: Item[]) {
//         items.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             var result = FileHelper.compareVersion(a.version!, b.version!)
//             return this.ascending ? result : -result
//         })
//     }

//     private sortServiceItemStatus(restArray: Item[]) {
//         restArray.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             var result = a.status.localeCompare(b.status)
//             return this.ascending ? result : -result
//         })
//     }

//     private sortServiceItemStartKind(restArray: Item[]) {
//         restArray.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             var result = a.startType < b.startType ? 1 : -1
//             return this.ascending ? result : -result
//         })
//     }

//     private sortRegistryName(restArray: Item[]) {
//         restArray.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             var result = a.name.localeCompare(b.name)
//             return this.ascending ? result : -result
//         })
//     }

//     private sortRegistryValue(restArray: Item[]) {
//         restArray.sort((a, b) => {
//             /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
//             /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
//             var result = a.value.localeCompare(b.value)
//             return this.ascending ? result : -result
//         })
//     }

//     private canBeSelected(itemIndex: number) {
//         if (!this.itemsToShow)
//             return false;
//         var item = this.itemsToShow[itemIndex]
//         if (!item)
//             return false
//         switch ((<Item>this.itemsToShow[itemIndex]).kind) {
//             case ItemsKind.Directory:
//                 return true
//             case ItemsKind.File:
//                 return true
//             case ItemsKind.Service:
//                 return true
//             default:
//                 return false
//         }
//     }

//     /**
//     * Die Einträge des zugehörigen ItemsModel
//     */
//     private items: Item[]
//     /**
//     * Die ggf. sortierten Einträge, die angezeigt werden können
//     */
//     private itemsToShow: Item[]
//     private ascending: boolean

//     private itemSortKind: ItemSortKind

//     /**
//     * Das Element, welches über Änderungen benachrichtigt werden soll
//     */
//     private observator: IView

//     private selectionChanged: ISelectionChanged
// }

// export { ItemSortKind, ISorter, ItemsSorter }
//         this.sortItems()
//         if (preserveCurrentItem && !newCurrentIndex) {
//             this.itemsToShow.forEach((item, i) => {
//                 if (item.name == currentItem.name)
//                     newCurrentIndex = i
//             })
//         }

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
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



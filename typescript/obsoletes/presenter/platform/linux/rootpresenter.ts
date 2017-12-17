
//     protected processFill(selectedPath?: string) {
//         return new Promise<void>(async resolve => {

//             // const initialItems = [ {
//             //     displayName: 'Home',
//             //     description: "Persönlicher Ordner",
//             //     size: -1,
//             //     type: "",
//             //     path: process.env.HOME!,
//             //     isDirectory: true
//             // }]

//             //var rootItems = await this.getItems()
//             this.items = await getDrives()
// //            this.items = initialItems.concat(rootItems)
//             this.itemsChanged(selectedPath)

//             resolve()
//         })
//     }

//     protected createItem(item?: RootItem) : HTMLTableRowElement {
//         const tr = document.createElement("tr")
        
//         const linuxRootItem = item as LinuxRootItem
//         if (item && !item.path)
//             tr.classList.add("it-hidden")
    
//         let td = PresenterBase.itemIconNameTemplate.cloneNode(true) as HTMLTableDataCellElement
//         let img = td.querySelector('img') as HTMLImageElement
//         img.src = "assets/images/drive.png"
//         let span = td.querySelector('span') as HTMLSpanElement
//         span.innerText = item ? item.displayName : 'W'
//         tr.appendChild(td)
        
//         td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
//         span = td.querySelector('span') as HTMLSpanElement
//         span.innerText = item ? item.description : 'W'
//         tr.appendChild(td)

//         td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
//         span = td.querySelector('span') as HTMLSpanElement
//         span.innerText = item ? item.path : 'W'
//         tr.appendChild(td)

//         td = PresenterBase.itemRightTemplate.cloneNode(true) as HTMLTableDataCellElement
//         span = td.querySelector('span') as HTMLSpanElement
//         span.innerText = item ? formatFileSize(item.size) : 'W'
//         tr.appendChild(td)
        
//         td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
//         span = td.querySelector('span') as HTMLSpanElement
//         span.innerText = linuxRootItem ? linuxRootItem.driveType : 'W'
//         tr.appendChild(td)

//         tr.tabIndex = 1
//         return tr
//     }
// }
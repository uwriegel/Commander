// import { Presenter } from './presenter.js'
// import { View }  from '../view.js'
// import { Item } from '../model/item.js'
// export { Presenter }  from './presenter.js'

// export abstract class PresenterBase implements Presenter
// {
//     showHidden: boolean

//     registerView(view: View): void {
//         this.view = view
//         this.setColumns()
//     }

//     getPath() { return this.path }
    

    


//     fill(path: string, selectPath?: string): Promise<void> {
//         this.path = path
//         return this.processFill(selectPath)
//     }


//     abstract checkPath(path: string): boolean

//     isDefault = false

//     sort(_: number, __: boolean) {
//         return false
//     }


   
//     protected canBeSelected(_: number) {
//         return false
//     }
    
//     protected abstract processFill(selectPath?: string): Promise<void>

//     protected static readonly itemIconNameTemplate: HTMLTableDataCellElement = 
//         (document.getElementById('tableDataItemIconNameTemplate') as HTMLTemplateElement).content.querySelector('td')!
//     protected static readonly itemTemplate: HTMLTableDataCellElement = 
//         (document.getElementById('tableDataItemTemplate') as HTMLTemplateElement).content.querySelector('td')!
//     protected static readonly itemRightTemplate: HTMLTableDataCellElement = 
//         (document.getElementById('tableDataItemRightTemplate') as HTMLTemplateElement).content.querySelector('td')!

//     protected abstract createItem(name?: Item) : HTMLTableRowElement
//     protected abstract setColumns(): void

//     protected path: string
//     protected sortAscending = true
//     private originalItems: Item[] = []        
// }


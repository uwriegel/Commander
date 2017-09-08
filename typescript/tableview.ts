import { Scrollbar }  from './scrollbar'
import { ColumnsControl }  from './columnscontrol'
import { IItemsViewModel }  from './itemsviewmodel'

class TableView implements IView
{
    /**
     * Listview mit mehreren Spalten
     * 
     * @param parent Das Elternelement, das die Tableview beinhaltet
     */
    constructor(parent: HTMLElement) 
    {
        this.id = 'tableView-' + TableView.tableViewId++
        this.tableView = document.createElement("div")
        this.tableView.classList.add('tableView')
        this.tableView.id = this.id
        this.tableView.tabIndex = 1
        parent.appendChild(this.tableView)

        this.scrollbar = new Scrollbar(parent, this.scroll.bind(this))

        this.table = document.createElement("table")
        this.table.classList.add('tableViewTable')
        this.tableView.appendChild(this.table)

        this.tableView.addEventListener("focusin", e =>
        {
            if (this.onFocus)
                this.onFocus()
            this.focus()
        })

        this.tableView.onkeydown = e =>
        {
            switch (e.which)
            {
                case 13: // Return
                    if (this.onSelectedCallback)
                        this.onSelectedCallback(this.currentItemIndex, e.ctrlKey, e.altKey)
                    break;
                case 33:
                    this.pageUp()
                    break
                case 34:
                    this.pageDown()
                    break
                case 35: // End
                    if (!e.shiftKey)
                        this.end()
                    break
                case 36: //Pos1
                    if (!e.shiftKey)
                        this.pos1()
                    break
                case 38:
                    this.upOne()
                    break
                case 40:
                    this.downOne()
                    break
                default:
                    return // exit this handler for other keys
            }
            e.preventDefault() // prevent the default action (scroll / move caret)
        }

        this.recentHeight = this.tableView.clientHeight

        window.requestAnimationFrame(() => this.resizeChecking())

        this.thead = document.createElement("thead")
        this.table.appendChild(this.thead)

        this.tbody = document.createElement("tbody")
        this.table.appendChild(this.tbody)

        this.tbody.addEventListener('mousewheel', evt =>
        {
            var wheelEvent = <WheelEvent>evt
            var delta = wheelEvent.wheelDelta / Math.abs(wheelEvent.wheelDelta) * 3
            this.scroll(this.startPosition - delta)
        });

        this.tbody.ondblclick = () => 
        {
            if (this.onSelectedCallback)
                this.onSelectedCallback(this.currentItemIndex, false, false)
        }

        {
            let tr = document.createElement("tr")
            this.thead.appendChild(tr)
        }

        this.scrollbar.initialize(this)

        this.tbody.onmousedown = evt =>
        {
            var tr = <HTMLTableRowElement>(<HTMLElement>evt.target).closest("tr")
            this.currentItemIndex = Array.from(this.tbody.querySelectorAll("tr")).findIndex(n => n == tr) + this.startPosition

            if (this.onCurrentItemChanged)
                this.onCurrentItemChanged(this.currentItemIndex)

            if (!this.hasFocus())
                tr.focus()
            else if (this.onToggleSelection)
                this.onToggleSelection(this.currentItemIndex)
        }

        this.setColumns(new ColumnsControl([
            {
                item: "Name",
                class: "nein"
            },
            {
                item: "Beschreibung",
                class: "nein"
            }
            
        ], "4"))
    }

    getCurrentItemIndex()
    {
        return this.currentItemIndex
    }

    ItemsCleared()
    {
        this.currentItemIndex = 0
        this.clearItems()
    }

    itemsChanged(lastCurrentIndex: number)
    {
        this.ItemsCleared()
        this.currentItemIndex = lastCurrentIndex
        this.displayItems(0)

        if (this.tableView == document.activeElement)
            this.focus()
        this.scrollIntoView()
        if (this.onCurrentItemChanged)
            this.onCurrentItemChanged(this.currentItemIndex)
    }

    updateItems()
    {
        var trs = this.tbody.querySelectorAll('tr')
        for (var i = 0; i < trs.length; i++)
        {
            this.itemsViewModel.updateItem(trs[i], i + this.startPosition)
        }
    }

    refreshSelection(itemIndex: number, isSelected: boolean)
    {
        var item = this.tbody.querySelectorAll('tr')[itemIndex - this.startPosition]
        if (isSelected)
            item.classList.add("selected")
        else
            item.classList.remove("selected")
    }
    
    setPresenter(presenter: Presenter)
    {
        this.presenter = presenter
        this.presenter.registerView(this)
    }

    setItemsViewModel(itemsViewModel: IItemsViewModel)
    {
        this.itemsViewModel = itemsViewModel
    }

    setOnSelectedCallback(callback: (itemIndex: number, openWith: boolean, showProperties: boolean) => void)
    {
        this.onSelectedCallback = callback
    }

    setOnCurrentItemChanged(callback: (itemIndex: number)=>void)
    {
        this.onCurrentItemChanged = callback
    }

    setOnFocus(callback: ()=>void)
    {
        this.onFocus = callback
    }

    setOnToggleSelection(callback: (itemIndex: number) => void)
    {
        this.onToggleSelection = callback
    }

    setOnDragCallback(callback: () => void)
    {
        this.onDragCallback = callback
    }

    /**
     * Setzen des Focuses
     * @returns true, wenn der Fokus gesetzt werden konnte
     */
    focus(): boolean
    {
        if (this.onCurrentItemChanged)
            this.onCurrentItemChanged(this.currentItemIndex)

        var index = this.currentItemIndex - this.startPosition
        if (index >= 0 && index < this.tableCapacity)
        {
            var trs = this.tbody.querySelectorAll('tr')
            if (index < trs.length)
            {
                trs[index].focus()
                return true
            }
        }
        this.tableView.focus()
        return false
    }

    pos1()
    {
        this.clearItems()
        this.displayItems(0)
        this.currentItemIndex = 0
        this.tbody.querySelectorAll('tr')[0].focus()
        if (this.onCurrentItemChanged)
            this.onCurrentItemChanged(this.currentItemIndex)
    }

    downOne()
    {
        if (this.currentItemIndex == this.itemsCount - 1)
            return false

        this.scrollIntoView()

        this.currentItemIndex++
        if (this.currentItemIndex - this.startPosition >= this.tableCapacity)
        {
            this.tbody.querySelector('tr')!.remove()
            this.startPosition += 1
            this.scrollbar.setPosition(this.startPosition)
            if (this.currentItemIndex < this.itemsCount - 1)
            {
                var node = this.insertItem(this.currentItemIndex + 1)
                this.tbody.appendChild(node)
            }
        }

        this.tbody.querySelectorAll('tr')[this.currentItemIndex - this.startPosition].focus()
        if (this.onCurrentItemChanged)
            this.onCurrentItemChanged(this.currentItemIndex)
        return true
    }


    isMouseWithin(x: number, y: number): boolean
    {
        var rect = this.tableView.getBoundingClientRect()
        rect.left, rect.top, rect.width, rect.bottom

        //console.log(`${x} ${y} ${rectObject.left} ${rectObject.top} ${rectObject.width} ${rectObject.bottom}`)

        var result = (x > rect.left && x < (rect.left + rect.width)
            && y > rect.top && y < (rect.top + rect.bottom))
        if (result)
            this.tableView.classList.add("highlight")
        else
            this.tableView.classList.remove("highlight")
        return result
    }

    dragLeave()
    {
        this.tableView.classList.remove("highlight")
    }

    private setColumns(value: ColumnsControl)
    {
        this.columnsControl = value

        const theadrow = this.thead.querySelector('tr')!
        theadrow.innerHTML = ""
        this.columnsControl.initializeEachColumn(item =>
        {
            var th = document.createElement("th")
            th.innerHTML = item.item
            if (item.class)
                th.classList.add(item.class)
            theadrow.appendChild(th)
        })

        //this.itemsViewModel.setColumns(value)
        this.columnsControl.initialize(this.tableView)
    }

    private initializeRowHeight()
    {
        var node = this.itemsViewModel.insertMeasureItem()
        this.tbody.appendChild(node)
        var td = this.tbody.querySelector('td')!
        this.rowHeight = td.clientHeight
        this.clearItems()
    }

    private calculateTableHeight()
    {
        if (this.rowHeight)
        {
            this.scrollbar.setOffsetTop(this.thead.offsetHeight)
            this.tableCapacity = Math.floor((this.tableView.offsetHeight - this.thead.offsetHeight) / this.rowHeight)
            if (this.tableCapacity < 0)
                this.tableCapacity = 0
        }
        else
            this.tableCapacity = -1
        this.scrollbar.itemsChanged(0, this.tableCapacity)
    }

    private insertItem(index: number): HTMLTableRowElement
    {
        return this.itemsViewModel.insertItem(index, this.onDragCallback)
    }

    private clearItems()
    {
        var hasFocus = this.hasFocus() 
        this.tbody.innerHTML = ''
        if (hasFocus)
            this.tableView.focus()
    }

    private hasFocus()
    {
        return this.tableView.contains(document.activeElement)
    }

    private displayItems(start: number)
    {
        this.startPosition = start
        this.itemsCount = this.presenter.getItemsCount()

        if (this.tableCapacity == -1)
        {
            this.initializeRowHeight()
            this.calculateTableHeight()
        }

        const end = Math.min(this.tableCapacity + 1 + this.startPosition, this.itemsCount)
        for (let i = this.startPosition; i < end; i++)
        {
            var node = this.insertItem(i)
            this.tbody.appendChild(node)
        }

        this.scrollbar.itemsChanged(this.itemsCount, this.tableCapacity, this.startPosition)
    }

    private upOne()
    {
        if (this.currentItemIndex == 0)
            return
        this.scrollIntoView()

        this.currentItemIndex--
        if (this.currentItemIndex - this.startPosition < 0)
        {
            if (this.currentItemIndex + this.tableCapacity < this.itemsCount - 1)
            {
                var trs = this.tbody.querySelectorAll('tr')
                trs[trs.length - 1].remove()
            }
            if (this.currentItemIndex >= 0)
            {
                this.startPosition -= 1
                this.scrollbar.setPosition(this.startPosition)
                var node = this.insertItem(this.currentItemIndex)
                this.tbody.insertBefore(node, this.tbody.firstChild)
            }
        }

        this.tbody.querySelectorAll('tr')[this.currentItemIndex - this.startPosition].focus()
        if (this.onCurrentItemChanged)
            this.onCurrentItemChanged(this.currentItemIndex)
    }


    private pageUp()
    {
        if (this.currentItemIndex == 0)
            return

        this.scrollIntoView()

        if (this.currentItemIndex - this.startPosition > 0)
            this.currentItemIndex = this.startPosition
        else
        {
            this.currentItemIndex -= this.tableCapacity
            if (this.currentItemIndex < 0)
                this.currentItemIndex = 0
            this.clearItems()
            this.displayItems(this.currentItemIndex)
        }

        this.tbody.querySelectorAll('tr')[this.currentItemIndex - this.startPosition].focus()
        if (this.onCurrentItemChanged)
            this.onCurrentItemChanged(this.currentItemIndex)
    }

    private pageDown()
    {
        if (this.currentItemIndex == this.itemsCount - 1)
            return

        this.scrollIntoView()

        if (this.currentItemIndex - this.startPosition < this.tableCapacity - 1)
        {
            this.currentItemIndex = Math.min(this.tableCapacity, this.itemsCount) - 1 + this.startPosition
            if (this.currentItemIndex >= this.itemsCount)
                this.currentItemIndex = this.itemsCount - 1
        }
        else
        {
            this.currentItemIndex += this.tableCapacity
            if (this.currentItemIndex >= this.itemsCount)
                this.currentItemIndex = this.itemsCount - 1
            this.clearItems()
            this.displayItems(this.currentItemIndex - this.tableCapacity + 1)
        }

        this.tbody.querySelectorAll('tr')[this.currentItemIndex - this.startPosition].focus()
        if (this.onCurrentItemChanged)
            this.onCurrentItemChanged(this.currentItemIndex)
    }
    
    private end()
    {
        this.clearItems()
        this.currentItemIndex = this.itemsCount - 1
        var startPos = this.currentItemIndex - this.tableCapacity + 1
        if (startPos < 0)
            startPos = 0
        this.displayItems(startPos)
        this.tbody.querySelectorAll('tr')[this.currentItemIndex - this.startPosition].focus()
        if (this.onCurrentItemChanged)
            this.onCurrentItemChanged(this.currentItemIndex)
    }

    private scrollIntoView()
    {
        var selector = this.currentItemIndex - this.startPosition;
        if (selector < 0)
            this.scroll(this.currentItemIndex)
        else if (selector >= this.tableCapacity)
        {
            this.scroll(this.currentItemIndex)
            this.scroll(this.currentItemIndex - this.tableCapacity + 1)
        }
    }

    private scroll(position: number)
    {
        if (this.itemsCount < this.tableCapacity)
            return
        if (position < 0)
            position = 0
        else if (position > this.itemsCount - this.tableCapacity)
            position = this.itemsCount - this.tableCapacity
        this.startPosition = position
        this.clearItems()
        this.displayItems(this.startPosition)

        var selector = this.currentItemIndex - this.startPosition
        if (selector >= 0 && selector < this.tableCapacity)
            this.tbody.querySelectorAll('tr')[this.currentItemIndex - this.startPosition].focus()
        else
            this.tableView.focus()
    }

    private resizeChecking()
    {
        if (this.tableView.clientHeight != this.recentHeight)
        {
            var isFocused = this.tableView.contains(document.activeElement)
            this.recentHeight = this.tableView.clientHeight
            if (this.tableCapacity == -1)
                window.requestAnimationFrame(() => this.resizeChecking())
            var tableCapacityOld = this.tableCapacity
            this.calculateTableHeight()
            var itemsCountOld = Math.min(tableCapacityOld + 1, this.itemsCount - this.startPosition)
            var itemsCountNew = Math.min(this.tableCapacity + 1, this.itemsCount - this.startPosition)
            if (itemsCountNew < itemsCountOld)
            {
                for (i = itemsCountOld - 1; i >= itemsCountNew; i--)
                    this.tbody.children[i].remove()
            }
            else
            {
                for (var i = itemsCountOld; i < itemsCountNew; i++)
                {
                    var node = this.insertItem(i + this.startPosition)
                    this.tbody.appendChild(node)
                }
            }
            if (isFocused)
                this.focus()
        }
        window.requestAnimationFrame(() => this.resizeChecking())
    }

    private static tableViewId = 1000;

    private readonly id: string
    private columnsControl: ColumnsControl
    private presenter: Presenter
    private itemsViewModel: IItemsViewModel
    private readonly tableView: HTMLDivElement
    private itemsCount = 0
    /**
    * Index des aktuellen Eintrags in der Liste der Einträge (items)
    */
     private currentItemIndex = 0
    private startPosition = 0
    /**
    * Die Anzahl der Einträge, die dieses TableView in der momentanen Größe tatsächlich auf dem Bildschirm anzeigen kann
    */
    private tableCapacity = -1
    private rowHeight: number
    private readonly scrollbar: Scrollbar

    private readonly table: HTMLTableElement
    private recentHeight: number

    private thead: HTMLTableSectionElement
    private tbody: HTMLTableSectionElement

    private onCurrentItemChanged: (itemIndex: number) => void
    private onToggleSelection: (itemIndex: number) => void
    private onDragCallback: () => void
    private onSelectedCallback: (itemIndex: number, openWith: boolean, showProperties: boolean)=>void
    private onFocus: ()=>void
}

export { TableView }
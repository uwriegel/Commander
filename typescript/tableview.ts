import { createScrollbar }  from './scrollbar.js'
import { ColumnsControl }  from './columnscontrol.js'
import { Presenter }  from './presenter/presenter.js'
import { EmptyPresenter }  from './presenter/emptypresenter.js'

/**
 * Listview mit mehreren Spalten
 * 
 * @param parent Das Elternelement, das die Tableview beinhaltet
 */
export function createTableView(parent: HTMLElement) {
    const tableView = document.createElement("div")

    let columnsControl: ColumnsControl
    let itemsCount = 0
    /**
    * Index des aktuellen Eintrags in der Liste der Einträge (items)
    */
    let currentItemIndex = 0
    let startPosition = 0
    /**
    * Die Anzahl der Einträge, die dieses TableView in der momentanen Größe tatsächlich auf dem Bildschirm anzeigen kann
    */
    let tableCapacity = -1
    let rowHeight: number

    let presenter: Presenter = new EmptyPresenter()

    let onCurrentItemChanged: (itemIndex: number) => void
    let onToggleSelection: (itemIndex: number) => void
    let onDragCallback: () => void
    let onSelectedCallback: (itemIndex: number, openWith: boolean, showProperties: boolean)=>void
    let onFocus: ()=>void

    tableView.classList.add('tableView')
    tableView.tabIndex = 1
    parent.appendChild(tableView)

    const scrollbar = createScrollbar(parent, scroll)

    const table = document.createElement("table")
    table.classList.add('tableViewTable')
    tableView.appendChild(table)

    tableView.addEventListener("focusin", () => {
        if (onFocus)
            onFocus()
        focus()
    })

    tableView.onkeydown = e => {
        switch (e.which) {
            case 13: // Return
                if (onSelectedCallback)
                    onSelectedCallback(currentItemIndex, e.ctrlKey, e.altKey)
                break;
            case 33:
                pageUp()
                break
            case 34:
                pageDown()
                break
            case 35: // End
                if (!e.shiftKey)
                    end()
                break
            case 36: //Pos1
                if (!e.shiftKey)
                    pos1()
                break
            case 38:
                upOne()
                break
            case 40:
                downOne()
                break
            default:
                return // exit this handler for other keys
        }
        e.preventDefault() // prevent the default action (scroll / move caret)
    }

    let recentHeight = tableView.clientHeight
    const thead = document.createElement("thead")
    table.appendChild(thead)

    const tbody = document.createElement("tbody")
    table.appendChild(tbody)

    tbody.addEventListener('mousewheel', evt => {
        var wheelEvent = <WheelEvent>evt
        var delta = wheelEvent.wheelDelta / Math.abs(wheelEvent.wheelDelta) * 3
        scroll(startPosition - delta)
    })

    tbody.ondblclick = () => {
        if (onSelectedCallback)
            onSelectedCallback(currentItemIndex, false, false)
    }

    {
        let tr = document.createElement("tr")
        thead.appendChild(tr)
    }

    scrollbar.initialize(focus)

    tbody.onmousedown = evt =>{
        const tr = <HTMLTableRowElement>(<HTMLElement>evt.target).closest("tr")
        currentItemIndex = Array.from(tbody.querySelectorAll("tr")).findIndex(n => n == tr) + startPosition

        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)

        if (!hasFocus())
            tr.focus()
        else if (onToggleSelection)
            onToggleSelection(currentItemIndex)
    }

    window.addEventListener('resize', () => resizeChecking())        

    function setPresenter(presenterToSet: Presenter) {
        presenter = presenterToSet
        presenter.registerView(view)
    }

    function getPresenter() {
        return presenter
    }
    
    function getCurrentItemIndex() {
        return currentItemIndex
    }

    function ItemsCleared() {
        currentItemIndex = 0
        clearItems()
    }

    function itemsChanged(lastCurrentIndex: number) {
        ItemsCleared()
        currentItemIndex = lastCurrentIndex
        displayItems(0)

        if (tableView == document.activeElement)
            focus()
        scrollIntoView()
        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)
    }

    function updateItems() {
        const trs = tbody.querySelectorAll('tr')
        for (let i = 0; i < trs.length; i++) 
            presenter.updateItem(trs[i], i + startPosition)
    }

    function updateSelections() {
        const trs = tbody.querySelectorAll('tr')
        for (let i = 0; i < trs.length; i++) 
            presenter.updateSelection(trs[i], i + startPosition)
    }

    function updateSelection(itemIndex: number) {
        const item = tbody.querySelectorAll('tr')[itemIndex - startPosition]
        presenter.updateSelection(item, itemIndex)
    }
    
    function setOnSelectedCallback(callback: (itemIndex: number, openWith: boolean, showProperties: boolean) => void) {
        onSelectedCallback = callback
    }

    function setOnCurrentItemChanged(callback: (itemIndex: number) => void) {
        onCurrentItemChanged = callback
    }

    function setOnFocus(callback: ()=>void) {
        onFocus = callback
    }

    function setOnToggleSelection(callback: (itemIndex: number) => void) {
        onToggleSelection = callback
    }

    function setOnDragCallback(callback: () => void) {
        onDragCallback = callback
    }

    /**
     * Setzen des Focuses
     * @returns true, wenn der Fokus gesetzt werden konnte
     */
    function focus(): boolean {
        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)

        const index = currentItemIndex - startPosition
        if (index >= 0 && index < tableCapacity) {
            const trs = tbody.querySelectorAll('tr')
            if (index < trs.length) {
                trs[index].focus()
                return true
            }
        }
        tableView.focus()
        return false
    }

    function pos1() {
        clearItems()
        displayItems(0)
        currentItemIndex = 0
        tbody.querySelectorAll('tr')[0].focus()
        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)
    }

    function downOne() {
        if (currentItemIndex == itemsCount - 1)
            return false

        scrollIntoView()

        currentItemIndex++
        if (currentItemIndex - startPosition >= tableCapacity) {
            tbody.querySelector('tr')!.remove()
            startPosition += 1
            scrollbar.setPosition(startPosition)
            if (currentItemIndex < itemsCount - 1) {
                const node = insertItem(currentItemIndex + 1)
                tbody.appendChild(node)
            }
        }

        tbody.querySelectorAll('tr')[currentItemIndex - startPosition].focus()
        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)
        return true
    }

    function isMouseWithin(x: number, y: number): boolean {
        const rect = tableView.getBoundingClientRect()
        rect.left, rect.top, rect.width, rect.bottom

        //console.log(`${x} ${y} ${rectObject.left} ${rectObject.top} ${rectObject.width} ${rectObject.bottom}`)

        const result = (x > rect.left && x < (rect.left + rect.width)
            && y > rect.top && y < (rect.top + rect.bottom))
        if (result)
            tableView.classList.add("highlight")
        else
            tableView.classList.remove("highlight")
        return result
    }

    function dragLeave() {
        tableView.classList.remove("highlight")
    }

    function setColumns(value: ColumnsControl) {
        columnsControl = value

        const theadrow = thead.querySelector('tr')!
        theadrow.innerHTML = ""
        columnsControl.initializeEachColumn(item => {
            const th = document.createElement("th")
            th.innerHTML = item
            theadrow.appendChild(th)
        })

        columnsControl.initialize(tableView, view)
    }

    function initializeRowHeight() {
        const node = presenter.insertMeasureItem()
        tbody.appendChild(node)
        const td = tbody.querySelector('td')!
        rowHeight = td.clientHeight
        clearItems()
    }

    function calculateTableHeight() {
        if (rowHeight) {
            tableCapacity = Math.floor((tableView.offsetHeight - thead.offsetHeight) / rowHeight)
            if (tableCapacity < 0)
                tableCapacity = 0
        }
        else
            tableCapacity = -1
        scrollbar.itemsChanged(0, tableCapacity)
    }

    function insertItem(index: number): HTMLTableRowElement {
        return presenter.insertItem(index, onDragCallback)
    }

    function hasFocus() {
        return tableView.contains(document.activeElement)
    }

    function clearItems() {
        const focus = hasFocus() 
        tbody.innerHTML = ''
        if (focus)
            tableView.focus()
    }

    function displayItems(start: number) {
        startPosition = start
        itemsCount = presenter.getItemsCount()

        if (tableCapacity == -1) {
            initializeRowHeight()
            calculateTableHeight()
        }

        const end = Math.min(tableCapacity + 1 + startPosition, itemsCount)
        for (let i = startPosition; i < end; i++) {
            var node = insertItem(i)
            tbody.appendChild(node)
        }

        scrollbar.itemsChanged(itemsCount, tableCapacity, startPosition)
    }

    function upOne() {
        if (currentItemIndex == 0)
            return
        scrollIntoView()

        currentItemIndex--
        if (currentItemIndex - startPosition < 0) {
            if (currentItemIndex + tableCapacity < itemsCount - 1) {
                const trs = tbody.querySelectorAll('tr')
                trs[trs.length - 1].remove()
            }
            if (currentItemIndex >= 0) {
                startPosition -= 1
                scrollbar.setPosition(startPosition)
                const node = insertItem(currentItemIndex)
                tbody.insertBefore(node, tbody.firstChild)
            }
        }

        tbody.querySelectorAll('tr')[currentItemIndex - startPosition].focus()
        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)
    }


    function pageUp() {
        if (currentItemIndex == 0)
            return

        scrollIntoView()

        if (currentItemIndex - startPosition > 0)
            currentItemIndex = startPosition
        else {
            currentItemIndex -= tableCapacity
            if (currentItemIndex < 0)
                currentItemIndex = 0
            clearItems()
            displayItems(currentItemIndex)
        }

        tbody.querySelectorAll('tr')[currentItemIndex - startPosition].focus()
        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)
    }

    function pageDown() {
        if (currentItemIndex == itemsCount - 1)
            return

        scrollIntoView()

        if (currentItemIndex - startPosition < tableCapacity - 1) {
            currentItemIndex = Math.min(tableCapacity, itemsCount) - 1 + startPosition
            if (currentItemIndex >= itemsCount)
                currentItemIndex = itemsCount - 1
        }
        else {
            currentItemIndex += tableCapacity
            if (currentItemIndex >= itemsCount)
                currentItemIndex = itemsCount - 1
            clearItems()
            displayItems(currentItemIndex - tableCapacity + 1)
        }

        tbody.querySelectorAll('tr')[currentItemIndex - startPosition].focus()
        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)
    }
    
    function end() {
        clearItems()
        currentItemIndex = itemsCount - 1
        let startPos = currentItemIndex - tableCapacity + 1
        if (startPos < 0)
            startPos = 0
        displayItems(startPos)
        tbody.querySelectorAll('tr')[currentItemIndex - startPosition].focus()
        if (onCurrentItemChanged)
            onCurrentItemChanged(currentItemIndex)
    }

    function scrollIntoView() {
        const selector = currentItemIndex - startPosition;
        if (selector < 0)
            scroll(currentItemIndex)
        else if (selector >= tableCapacity) {
            scroll(currentItemIndex)
            scroll(currentItemIndex - tableCapacity + 1)
        }
    }

    function scroll(position: number) {
        if (itemsCount < tableCapacity)
            return
        if (position < 0)
            position = 0
        else if (position > itemsCount - tableCapacity)
            position = itemsCount - tableCapacity
        startPosition = position
        clearItems()
        displayItems(startPosition)

        const selector = currentItemIndex - startPosition
        if (selector >= 0 && selector < tableCapacity)
            tbody.querySelectorAll('tr')[currentItemIndex - startPosition].focus()
        else
            tableView.focus()
    }

    function resizeChecking() {
        if (tableView.clientHeight != recentHeight) {
            const isFocused = tableView.contains(document.activeElement)
            recentHeight = tableView.clientHeight
            const tableCapacityOld = tableCapacity
            calculateTableHeight()
            const itemsCountOld = Math.min(tableCapacityOld + 1, itemsCount - startPosition)
            const itemsCountNew = Math.min(tableCapacity + 1, itemsCount - startPosition)
            if (itemsCountNew < itemsCountOld) {
                for (i = itemsCountOld - 1; i >= itemsCountNew; i--)
                    tbody.children[i].remove()
            }
            else {
                for (var i = itemsCountOld; i < itemsCountNew; i++) {
                    const node = insertItem(i + startPosition)
                    tbody.appendChild(node)
                }
            }
            if (isFocused)
                focus()
        }
    }

    const view = {
        setPresenter: setPresenter,
        getPresenter: getPresenter,
        getCurrentItemIndex: getCurrentItemIndex,
        ItemsCleared: ItemsCleared,
        itemsChanged: itemsChanged,
        updateItems: updateItems,
        updateSelections: updateSelections,
        updateSelection: updateSelection,
        setOnSelectedCallback: setOnSelectedCallback,
        setOnCurrentItemChanged: setOnCurrentItemChanged,
        setOnFocus: setOnFocus,
        setOnToggleSelection: setOnToggleSelection,
        setOnDragCallback: setOnDragCallback,
        focus: focus,
        pos1: pos1,
        downOne: downOne,
        isMouseWithin: isMouseWithin,
        dragLeave: dragLeave,
        setColumns: setColumns
    }
    return view
}

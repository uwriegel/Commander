import { View } from './view.js'

export interface ColumnsControl {
    initialize: (tableViewToSet: HTMLElement, viewToSet: View)=>void
    initializeEachColumn: (eachColumnAction: (item: string)=>void)=>void,
    getItemTemplate: ()=>HTMLTableRowElement
}

/**
 * Verwaltung der Spalten der TableView
 * @param columns columns Die Spalten der zugehörigen TableView
 * @param id Die Id dieses ColumnControls
 */
export function createColumnsControl(columns: string[], id: string) {
    const itemTemplate = document.createElement("tr")
    itemTemplate.style.userSelect = "none"
    const td = document.createElement("td")
    td.classList.add("it-name")
    const nameDiv = document.createElement("div")
    nameDiv.classList.add("it-iconName")
    const img = document.createElement("img")
    img.classList.add("it-image")
    img.src = 'assets/images/fault.png'
    img.alt = ""
    img.onerror = () => img.src = 'assets/images/fault.png' 
    const span = document.createElement("span")
    span.classList.add("it-nameValue")
    nameDiv.appendChild(img)
    nameDiv.appendChild(span)
    td.appendChild(nameDiv)
    itemTemplate.appendChild(td)
    itemTemplate.tabIndex = 0

    for (let i = 1; i < columns.length; i++) {
        const td = document.createElement("td")
        itemTemplate.appendChild(td)
    }

    /**
     * Initialisierung des ColumnControls
     * @param tableView Das HTMLElement der zugehörigen TableView
     */
    function initialize(tableViewToSet: HTMLElement, viewToSet: View) {
        tableView = tableViewToSet
        view = viewToSet
        const ths = tableView.getElementsByTagName("th")

        const json = localStorage[id]
        if (json) {
            const columnWidth = JSON.parse(json)
            setWidths(columnWidth)
        }
        else
            setWidths()

        let grippingReady = false;
        Array.from(ths).forEach((th, columnIndex) => {
            th.onmousedown = evt => {
                const column = <HTMLElement>evt.target
                if (!grippingReady) {
                    const ascending = column.classList.contains("sortAscending")
                    if (view.Presenter.sort(columnIndex, !ascending)) {
                        for (let i = 0; i < ths.length; i++) {
                            ths[i].classList.remove("sortAscending")
                            ths[i].classList.remove("sortDescending")
                        }
                            
                        column.classList.add(ascending ? "sortDescending" : "sortAscending")
                    }
                }
                else
                    beginColumnDragging(evt.pageX, column)
            }
        })

        tableView.addEventListener('mousemove', evt => {
            const th = <HTMLElement>evt.target
            if (th.localName == "th" && (th.offsetLeft > 0 || evt.pageX - th.getBoundingClientRect().left > 10)
                    && (th.offsetLeft + th.offsetWidth < tableView.offsetWidth || evt.pageX - th.getBoundingClientRect().left < 4)
                    && (th.getBoundingClientRect().left + th.offsetWidth - evt.pageX < 4 || evt.pageX - th.getBoundingClientRect().left < 4))  {
                document.body.style.cursor = 'ew-resize'
                grippingReady = true
                previous = evt.pageX - th.getBoundingClientRect().left < 4
            }
            else {
                document.body.style.cursor = 'default'
                grippingReady = false
            }
        });
    }

    function initializeEachColumn(eachColumnAction: (item: string)=>void) {
        columns.forEach(eachColumnAction)
    }

    function getItemTemplate(): HTMLTableRowElement {
        return <HTMLTableRowElement>itemTemplate.cloneNode(true);
    }

    function beginColumnDragging(startGripPosition: number, targetColumn: HTMLElement) {
        document.body.style.cursor = 'ew-resize'

        let currentHeader: HTMLElement
        if (!previous)
            currentHeader = targetColumn
        else
            currentHeader = <HTMLElement>targetColumn.previousElementSibling
        const nextHeader = <HTMLElement>currentHeader.nextElementSibling
        const currentLeftWidth = currentHeader.offsetWidth
        const sumWidth = currentLeftWidth + nextHeader.offsetWidth

        const onmove = (evt: MouseEvent) => {
            if (evt.which == 0) {
                document.body.style.cursor = 'default'
                window.removeEventListener('mousemove', onmove)
                return
            }
            document.body.style.cursor = 'ew-resize'

            var diff = evt.pageX - startGripPosition

            if (currentLeftWidth + diff < 15)
                diff = 15 - currentLeftWidth
            else if (diff > sumWidth - currentLeftWidth - 15)
                diff = sumWidth - currentLeftWidth - 15

            const combinedWidth = getCombinedWidth(currentHeader, nextHeader)

            let leftWidth = currentLeftWidth + diff
            let rightWidth = sumWidth - currentLeftWidth - diff
            const factor = combinedWidth / sumWidth
            leftWidth = leftWidth * factor
            rightWidth = rightWidth * factor

            currentHeader.style.width = leftWidth + '%'
            nextHeader.style.width = rightWidth + '%'
            const columnsWidths = getWidths()
            localStorage[id] = JSON.stringify(columnsWidths)

            evt.preventDefault()
        }

        window.addEventListener('mousemove', onmove)
    }

    function getWidths() {
        let widths = new Array()
        const ths = tableView.getElementsByTagName("th")
        Array.from(ths).forEach((th, i) => {
            widths[i] = th.style.width
            if (!widths[i])
                widths[i] = (100 / columns.length) + '%'
        })
        return widths
    }

    function setWidths(widths?: string[]) {
        const ths = tableView.getElementsByTagName("th")

        if (!widths) {
            const width: number | string = 100 / ths.length
            widths = []
            for (let i = 0; i < ths.length; i++)
                widths.push(width + '%')
        }

        Array.from(ths).forEach((th, i) => {
            if (widths)
                th.style.width = widths[i]
        })
    }

    function getCombinedWidth(column: HTMLElement, nextColumn: HTMLElement) {
        const firstWidth = column.style.width ? parseFloat(column.style.width.substr(0, column.style.width.length - 1)) : 100 / columns.length
        const secondWidth = nextColumn.style.width ? parseFloat(nextColumn.style.width.substr(0, nextColumn.style.width.length - 1)) : 100 / columns.length
        return firstWidth + secondWidth
    }

    var previous = false
    var tableView: HTMLElement
    var view: View

    return {
        initialize: initialize,
        initializeEachColumn: initializeEachColumn,
        getItemTemplate: getItemTemplate
    }
}


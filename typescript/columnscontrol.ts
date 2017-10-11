import { View } from './view'

declare class IColumn {
    item: string
    class: string
}

class ColumnsControl {
    /**
     * Verwaltung der Spalten der TableView
     * @param columns Die Spalten der zugehörigen TableView
     * @param id Die Id dieses ColumnControls
     * @param sortOffset
     */
    constructor(columns: IColumn[], id: string) {
        this.columns = columns
        this.id = id

        this.itemTemplate = document.createElement("tr")
        this.itemTemplate.style.userSelect = "none"
        const td = document.createElement("td")
        td.classList.add("it-name")
        const nameDiv = document.createElement("div")
        nameDiv.classList.add("it-iconName")
        const img = document.createElement("img")
        img.classList.add("it-image")
        img.src = 'images/fault.png'
        img.alt = ""
        img.onerror = () => img.src = 'images/fault.png' 
        const span = document.createElement("span")
        span.classList.add("it-nameValue")
        nameDiv.appendChild(img)
        nameDiv.appendChild(span)
        td.appendChild(nameDiv)
        this.itemTemplate.appendChild(td)
        this.itemTemplate.tabIndex = 0

        for (var i = 1; i < columns.length; i++) {
            const td = document.createElement("td")
            td.classList.add(columns[i].class)
            this.itemTemplate.appendChild(td)
        }
    }

    /**
     * Initialisierung des ColumnControls
     * @param tableView Das HTMLElement der zugehörigen TableView
     */
    initialize(tableView: HTMLElement, view: View) {
        this.tableView = tableView
        this.view = view
        const ths = tableView.getElementsByTagName("th")

        const json = localStorage[this.id]
        if (json) {
            const columnWidth = JSON.parse(json)
            this.setWidths(columnWidth)
        }
        else
            this.setWidths()

        let grippingReady = false;
        Array.from(ths).forEach((th, columnIndex) => {
            th.onmousedown = evt => {
                const column = <HTMLElement>evt.target
                if (!grippingReady) {
                    const ascending = column.classList.contains("sortAscending")
                    if (this.view.Presenter.sort(columnIndex, !ascending)) {
                        for (let i = 0; i < ths.length; i++) {
                            ths[i].classList.remove("sortAscending")
                            ths[i].classList.remove("sortDescending")
                        }
                            
                        column.classList.add(ascending ? "sortDescending" : "sortAscending")
                    }
                }
                else
                    this.beginColumnDragging(evt.pageX, column)
            }
        })

        this.tableView.addEventListener('mousemove', evt => {
            const th = <HTMLElement>evt.target
            if (th.localName == "th" && (th.offsetLeft > 0 || evt.pageX - th.getBoundingClientRect().left > 10)
                    && (th.offsetLeft + th.offsetWidth < tableView.offsetWidth || evt.pageX - th.getBoundingClientRect().left < 4)
                    && (th.getBoundingClientRect().left + th.offsetWidth - evt.pageX < 4 || evt.pageX - th.getBoundingClientRect().left < 4))  {
                document.body.style.cursor = 'ew-resize'
                grippingReady = true
                this.previous = evt.pageX - th.getBoundingClientRect().left < 4
            }
            else {
                document.body.style.cursor = 'default'
                grippingReady = false
            }
        });
    }

    initializeEachColumn(eachColumnAction: (item: IColumn)=>void) {
        this.columns.forEach(eachColumnAction)
    }

    getItemTemplate(): HTMLTableRowElement {
        return <HTMLTableRowElement>this.itemTemplate.cloneNode(true);
    }

    private beginColumnDragging(startGripPosition: number, targetColumn: HTMLElement) {
        document.body.style.cursor = 'ew-resize'

        let currentHeader: HTMLElement
        if (!this.previous)
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

            const combinedWidth = this.getCombinedWidth(currentHeader, nextHeader)

            let leftWidth = currentLeftWidth + diff
            let rightWidth = sumWidth - currentLeftWidth - diff
            const factor = combinedWidth / sumWidth
            leftWidth = leftWidth * factor
            rightWidth = rightWidth * factor

            currentHeader.style.width = leftWidth + '%'
            nextHeader.style.width = rightWidth + '%'
            const columnsWidths = this.getWidths()
            localStorage[this.id] = JSON.stringify(columnsWidths)

            evt.preventDefault()
        }

        window.addEventListener('mousemove', onmove)
    }

    private getWidths() {
        let widths = new Array()
        const ths = this.tableView.getElementsByTagName("th")
        Array.from(ths).forEach((th, i) => {
            widths[i] = th.style.width
            if (!widths[i])
                widths[i] = (100 / this.columns.length) + '%'
        })
        return widths
    }

    private setWidths(widths?: string[]) {
        const ths = this.tableView.getElementsByTagName("th")

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

    private getCombinedWidth(column: HTMLElement, nextColumn: HTMLElement) {
        const firstWidth = column.style.width ? parseFloat(column.style.width.substr(0, column.style.width.length - 1)) : 100 / this.columns.length
        const secondWidth = nextColumn.style.width ? parseFloat(nextColumn.style.width.substr(0, nextColumn.style.width.length - 1)) : 100 / this.columns.length
        return firstWidth + secondWidth
    }

   /**
    * ID dieses Controls
    */
    private readonly id: string
    private columns: IColumn[]
    
    /**
    * Das Element, das die TableView beinhaltet
    */
    private tableView: HTMLElement
    private view: View
    private readonly itemTemplate: HTMLTableRowElement
    private previous: boolean
}

export { ColumnsControl, IColumn }
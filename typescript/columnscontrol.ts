
declare class IColumn
{
    item: string
    class: string
//    itemSortKind: ItemSortKind
}

class ColumnsControl
{
    /**
     * Verwaltung der Spalten der TableView
     * @param columns Die Spalten der zugehörigen TableView
     * @param id Die Id dieses ColumnControls
     * @param sortOffset
     */
    constructor(columns: IColumn[], id: string) //, itemsSorter: ISorter)
    {
        this.columns = columns
        this.id = id
        //this.itemsSorter = itemsSorter

        this.itemTemplate = document.createElement("tr")
        this.itemTemplate.style.userSelect = "none"
        var td = document.createElement("td")
        td.classList.add("it-name")
        var nameDiv = document.createElement("div")
        nameDiv.classList.add("it-iconName")
        var img = document.createElement("img")
        img.classList.add("it-image")
        img.src = 'images/fault.png'
        img.alt = ""
        img.onerror = () => img.src = 'images/fault.png' 
        var span = document.createElement("span")
        span.classList.add("it-nameValue")
        nameDiv.appendChild(img)
        nameDiv.appendChild(span)
        td.appendChild(nameDiv)
        this.itemTemplate.appendChild(td)
        this.itemTemplate.tabIndex = 0

        for (var i = 1; i < columns.length; i++)
        {
            var td = document.createElement("td")
            td.classList.add(columns[i].class)
            this.itemTemplate.appendChild(td)
        }
    }

    /**
     * Initialisierung des ColumnControls
     * @param tableView Das HTMLElement der zugehörigen TableView
     */
    initialize(tableView: HTMLElement)
    {
        this.tableView = tableView
        var ths = tableView.getElementsByTagName("th")

        var json = localStorage[this.id]
        if (json)
        {
            var columnWidth = JSON.parse(json)
            this.setWidths(columnWidth)
        }
        else
            this.setWidths()

        var grippingReady = false;
        //Array.from(ths).forEach((th, i) =>
        Array.from(ths).forEach(th =>
        {
//            let columnIndex = i
            th.onmousedown = evt =>
            {
                var column = <HTMLElement>evt.target
                if (!grippingReady)
                {
                    var ascending = column.classList.contains("sortAscending")
                    for (let i = 0; i < ths.length; i++)
                    {
                        ths[i].classList.remove("sortAscending")
                        ths[i].classList.remove("sortDescending")
                    }
                        
                    column.classList.add(ascending ? "sortDescending" : "sortAscending")
                    //this.itemsSorter.sort(this.columns[columnIndex].itemSortKind, !ascending, true)
                }
                else
                    this.beginColumnDragging(evt.pageX, column)
            }
        })

        this.tableView.addEventListener('mousemove', evt =>
        {
            var th = <HTMLElement>evt.target
            if (th.localName == "th" && (th.offsetLeft > 0 || evt.pageX - th.getBoundingClientRect().left > 10)
                && (th.offsetLeft + th.offsetWidth < tableView.offsetWidth || evt.pageX - th.getBoundingClientRect().left < 4)
                && (th.getBoundingClientRect().left + th.offsetWidth - evt.pageX < 4 || evt.pageX - th.getBoundingClientRect().left < 4))
            {
                document.body.style.cursor = 'ew-resize'
                grippingReady = true
                this.previous = evt.pageX - th.getBoundingClientRect().left < 4
            }
            else
            {
                document.body.style.cursor = 'default'
                grippingReady = false
            }
        });
    }

    initializeEachColumn(eachColumnAction: (item: IColumn)=>void)
    {
        this.columns.forEach(eachColumnAction)
    }

    getItemTemplate(): HTMLTableRowElement
    {
        return <HTMLTableRowElement>this.itemTemplate.cloneNode(true);
    }

    private beginColumnDragging(startGripPosition: number, targetColumn: HTMLElement)
    {
        document.body.style.cursor = 'ew-resize'

        var currentHeader: HTMLElement
        if (!this.previous)
            currentHeader = targetColumn
        else
            currentHeader = <HTMLElement>targetColumn.previousElementSibling
        var nextHeader = <HTMLElement>currentHeader.nextElementSibling
        var currentLeftWidth = currentHeader.offsetWidth
        var sumWidth = currentLeftWidth + nextHeader.offsetWidth

        var onmove = (evt: MouseEvent) =>
        {
            if (evt.which == 0)
            {
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

            var combinedWidth = this.getCombinedWidth(currentHeader, nextHeader)

            var leftWidth = currentLeftWidth + diff
            var rightWidth = sumWidth - currentLeftWidth - diff
            var factor = combinedWidth / sumWidth
            leftWidth = leftWidth * factor
            rightWidth = rightWidth * factor

            currentHeader.style.width = leftWidth + '%'
            nextHeader.style.width = rightWidth + '%'
            var columnsWidths = this.getWidths()
            localStorage[this.id] = JSON.stringify(columnsWidths)

            evt.preventDefault()
        }

        window.addEventListener('mousemove', onmove)
    }

    private getWidths()
    {
        var widths = new Array()
        var ths = this.tableView.getElementsByTagName("th")
        Array.from(ths).forEach((th, i) =>
        {
            widths[i] = th.style.width
            if (!widths[i])
                widths[i] = (100 / this.columns.length) + '%'
        })
        return widths
    }

    private setWidths(widths?: string[])
    {
        var ths = this.tableView.getElementsByTagName("th")

        if (!widths)
        {
            var width: number | string = 100 / ths.length
            widths = []
            for (var i = 0; i < ths.length; i++)
            {
                widths.push(width + '%')
            }
        }

        Array.from(ths).forEach((th, i) =>
        {
            if (widths)
                th.style.width = widths[i]
        })
    }

    private getCombinedWidth(column: HTMLElement, nextColumn: HTMLElement): number
    {
        var firstWidth = column.style.width ? parseFloat(column.style.width.substr(0, column.style.width.length - 1)) : 100 / this.columns.length
        var secondWidth = nextColumn.style.width ? parseFloat(nextColumn.style.width.substr(0, nextColumn.style.width.length - 1)) : 100 / this.columns.length
        return firstWidth + secondWidth
    }

   /**
    * ID dieses Controls
    */
    private id: string
    private columns: IColumn[]
    
    /**
    * Das Element, das die TableView beinhaltet
    */
    private tableView: HTMLElement
    private itemTemplate: HTMLTableRowElement
    private previous: boolean
    //private itemsSorter: ISorter
}

export { ColumnsControl, IColumn }
import { TableView }  from './tableview.js'

class Scrollbar {
    /**
     * Scrollbar der TableView
     * 
     * @param parent Das Element, welches mit einer Scrollbar versehen werden soll
     * @param positionChanged Callback zum Scrollen
     */
    constructor(parent: HTMLElement, positionChanged: (position: number)=>void) {
        this.parent = parent
        this.positionChanged = positionChanged
        this.scrollbar = document.createElement("div")
        this.scrollbar.classList.add("scrollbar")
        this.scrollbar.classList.add("scrollbarHidden")

        var up = document.createElement("div")
        up.classList.add("scrollbarUp")
        this.scrollbar.appendChild(up)

        var upImg = document.createElement("div")
        upImg.classList.add("scrollbarUpImg")
        up.appendChild(upImg)

        var down = document.createElement("div")
        down.classList.add("scrollbarDown")
        this.scrollbar.appendChild(down)

        var downImg = document.createElement("div")
        downImg.classList.add("scrollbarDownImg")
        down.appendChild(downImg)

        this.grip = document.createElement("div")
        this.grip.classList.add("scrollbarGrip")
        this.scrollbar.appendChild(this.grip)

        parent.appendChild(this.scrollbar)

        up.onmousedown = () => {
            clearTimeout(this.timer)
            clearInterval(this.interval)
            this.mouseUp()

            this.timer = setTimeout(() => this.interval = setInterval(this.mouseUp.bind(this), 20), 600)
        }

        down.onmousedown = () => {
            clearTimeout(this.timer)
            clearInterval(this.interval)
            this.mouseDown()

            this.timer = setTimeout(() => this.interval = setInterval(this.mouseDown.bind(this), 20), 600)
        }

        this.scrollbar.onmousedown = evt => {
            if (!(<HTMLElement>evt.target).classList.contains("scrollbar"))
                return

            this.pageMousePosition = evt.pageY
            var isPageUp = evt.pageY < this.grip.offsetTop

            clearTimeout(this.timer)
            clearInterval(this.interval)
            if (isPageUp)
                this.pageUp()
            else
                this.pageDown()

            this.timer = setTimeout(() => this.interval = setInterval((isPageUp ? this.pageUp : this.pageDown).bind(this), 20), 600)
        }

        this.grip.onmousedown = evt =>
        {
            if (evt.which != 1)
                return
            this.gripping = true
            evt.preventDefault()

            this.gripTopDelta = this.grip.offsetTop + this.scrollbar.offsetTop - evt.pageY

            var gripperMove = (evt: MouseEvent) => {
                if (!this.gripping || evt.which != 1) {
                    window.removeEventListener('mousemove', gripperMove)
                    return
                }

                var top = evt.pageY + this.gripTopDelta - this.scrollbar.offsetTop
                if (top < 15)
                    top = 15
                else if (top + this.grip.offsetHeight - 15 > (this.parentHeight - 32))
                    top = this.parentHeight - 32 - this.grip.offsetHeight + 15
                this.grip.style.top = top + 'px'

                var currentPosition = Math.floor((top - 15) / this.step + 0.5)
                if (currentPosition != this.position)
                {
                    this.position = currentPosition
                    this.positionChanged(this.position)
                }
            }

            window.addEventListener('mousemove', gripperMove)
        }

        up.onmouseup = this.mouseup.bind(this)
        down.onmouseup = this.mouseup.bind(this)
        this.grip.onmouseup = this.mouseup.bind(this)
        this.scrollbar.onmouseup = this.mouseup.bind(this)

        this.scrollbar.onclick = evt => evt.stopPropagation()

        this.scrollbar.onmouseleave = () => {
            clearTimeout(this.timer)
            clearInterval(this.interval)
        }
    }

    initialize(tableView: TableView) {
        this.tableView = tableView
    }

    itemsChanged(itemsCount: number, tableCapacity: number, newPosition?: number) {
        this.parentHeight = this.parent.offsetHeight - this.offsetTop
        if (itemsCount)
            this.itemsCountAbsolute = itemsCount
        if (tableCapacity)
            this.itemsCountVisible = tableCapacity

        if (!this.itemsCountAbsolute)
            return

        if (this.itemsCountAbsolute <= this.itemsCountVisible)
            this.scrollbar.classList.add("scrollbarHidden")
        else
        {
            this.scrollbar.classList.remove("scrollbarHidden")
            var gripHeight = (this.parentHeight - 32) * (this.itemsCountVisible / this.itemsCountAbsolute)
            if (gripHeight < 5)
                gripHeight = 5
            this.steps = this.itemsCountAbsolute - this.itemsCountVisible
            this.step = (this.parentHeight - 32 - gripHeight) / this.steps
            this.grip.style.height = gripHeight + 'px'
            if (this.position > this.steps)
                this.position = this.steps
        }
        if (newPosition != undefined)
            this.position = newPosition
        this.positionGrip()
    }
    
    setPosition(position: number)
    {
        this.position = position
        if (this.position > this.steps)
            this.position = this.steps
        if (this.position < 0)
            this.position = 0
        this.positionGrip()
    }

    private mouseup()
    {
        clearTimeout(this.timer)
        clearInterval(this.interval)
        this.gripping = false
        this.tableView.focus()
    }

    private mouseUp()
    {
        this.position -= 1
        if (this.position < 0)
        {
            this.position = 0
            clearTimeout(this.timer)
            clearInterval(this.interval)
            return
        }

        this.positionGrip()
        this.positionChanged(this.position)
    }

    private mouseDown() {
        this.position += 1
        if (this.position > this.steps) {
            this.position = this.steps
            clearTimeout(this.timer)
            clearInterval(this.interval)
            return
        }
        this.positionGrip()
        this.positionChanged(this.position)
    }

    private pageUp()
    {
        if (this.grip.offsetTop < this.pageMousePosition)
        {
            clearTimeout(this.timer)
            clearInterval(this.interval)
            return
        }

        this.position -= this.itemsCountVisible - 1
        if (this.position < 0)
        {
            var lastTime = this.position != 0
            this.position = 0
            clearTimeout(this.timer)
            clearInterval(this.interval)
            if (lastTime)
            {
                this.positionGrip()
                this.positionChanged(this.position)
            }
            return
        }
        this.positionGrip()
        this.positionChanged(this.position)
    }

    private pageDown()
    {
        if (this.grip.offsetTop + this.grip.offsetHeight > this.pageMousePosition)
        {
            clearTimeout(this.timer)
            clearInterval(this.interval)
            return
        }

        this.position += this.itemsCountVisible - 1
        if (this.position > this.steps)
        {
            var lastTime = this.position != 0
            this.position = this.steps
            clearTimeout(this.timer)
            clearInterval(this.interval)
            if (lastTime)
            {
                this.positionGrip()
                this.positionChanged(this.position)
            }
            return
        }

        this.positionGrip()
        this.positionChanged(this.position)
    }

    private positionGrip()
    {
        var top = 15 + this.position * this.step
        this.grip.style.top = top + 'px'
    }

    private readonly parent: HTMLElement
    private tableView: TableView
    /**
    * Das Div der Scrollbar
    */
    private scrollbar: HTMLDivElement
    private position = 0
    private positionChanged: (position: number)=>void
    private gripTopDelta = -1
    private gripping = false
    private parentHeight: number
    private offsetTop = 0
    /**
    * Ein zyklischer Timer
    */
    private timer: NodeJS.Timer
    /**
    * Ein einmalige Timeout-Intervall
    */
    private interval: number
    private pageMousePosition: number
    private step: number
    private steps: number
    private itemsCountAbsolute: number
    private itemsCountVisible: number
    private grip: HTMLDivElement
}

export { Scrollbar }







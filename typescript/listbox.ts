class ListBox 
{
    constructor(container: HTMLElement)
    {
        this.container = container
    }

    appendItem(item: HTMLElement)
    {
        this.container.appendChild(item)
        this.itemCount++
        if (this.itemHeight == -1)
            this.initializeItemHeight()
        if (this.itemCount - this.topStartIndex > this.itemCapacity)
            item.classList.add('hidden')
    }

    private initializeItemHeight()
    {
        this.itemHeight = (<HTMLElement>this.container.children[0]).clientHeight
        this.itemCapacity = Math.floor(800 / this.container.clientHeight)
    }

    private container: HTMLElement
    private position = 0
    private itemCount = 0
    private itemHeight = -1
    private itemCapacity = 0
    private topStartIndex = 0
}
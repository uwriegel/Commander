
/**
 * Oben beide CommanderViews, unten, wenn eingeschaltet, der Viewer
 * @param gridContainer der beinhaltende Container
 * @param topView die obere Ansicht
 * @param bottomView die untere Ansicht
 * @param gridSplitter der Teiler
 * @param onChanged Callback, wird aufgerufen wenn die Aufteilung geändert wurde
  */
class VerticalGrid
{
    constructor(gridContainer: HTMLDivElement, topView: HTMLElement, bottomView: HTMLElement, gridSplitter: HTMLDivElement, onChanged: ()=>void)
    {
        this.topView = topView
        this.bottomView = bottomView
        this.gridSplitter = gridSplitter

        var grid = Grid(gridContainer, topView, bottomView, gridSplitter, (firstPercent) =>
        {
            this.topPercent = firstPercent
            localStorage["vgrid"] = firstPercent
            onChanged()
        }, true)

        this.topPercent = localStorage["vgrid"]
        if (!this.topPercent)
            this.topPercent = 70
        grid.setSize(this.topPercent)
        this.switchBottom()
    }

    /**
     * Ein/Ausblenden der unteren Ansicht
     */
    switchBottom()
    {
        if (this.bottomView.classList.contains("displayNone"))
        {
            this.bottomView.classList.remove("displayNone")
            this.gridSplitter.classList.remove("displayNone")
            this.topView.style.height = `calc(${this.topPercent}% - 3px)`
        }
        else
        {
            this.bottomView.classList.add("displayNone")
            this.gridSplitter.classList.add("displayNone")
            this.topView.style.height = "100%"
        }
    }

    private bottomView: HTMLElement
    private topView: HTMLElement
    private gridSplitter: HTMLDivElement
    private topPercent: number
}
    


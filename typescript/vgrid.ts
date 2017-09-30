import { Grid }  from './grid'

class VerticalGrid
{
    /**
     * Oben beide CommanderViews, unten, wenn eingeschaltet, der Viewer
     * @param gridContainer der beinhaltende Container
     * @param topView die obere Ansicht
     * @param bottomView die untere Ansicht
     * @param gridSplitter der Teiler
     * @param onChanged Callback, wird aufgerufen wenn die Aufteilung geändert wurde
     */
    constructor (gridContainer: HTMLDivElement, 
        private topView: HTMLElement, 
        private bottomView: HTMLElement, 
        private gridSplitter: HTMLDivElement, onChanged: ()=>void) {

        const grid = new Grid(gridContainer, topView, bottomView, gridSplitter, (firstPercent) =>
        {
            this.topPercent = firstPercent
            localStorage["vgrid"] = firstPercent
            onChanged()
        }, true)

        this.topPercent = localStorage["vgrid"]
        if (!this.topPercent)
            this.topPercent = 70
        grid.setSize(this.topPercent)
        this.switchBottom(false)
    }

    /**
     * Ein/Ausblenden der unteren Ansicht
     */
    switchBottom(preview: boolean) {
        if (preview) {
            this.bottomView.classList.remove("displayNone")
            this.gridSplitter.classList.remove("displayNone")
            this.topView.style.height = `calc(${this.topPercent}% - 3px)`
        } else {
            this.bottomView.classList.add("displayNone")
            this.gridSplitter.classList.add("displayNone")
            this.topView.style.height = "100%"
        }
    }

    private topPercent: number
}
    
export { VerticalGrid }

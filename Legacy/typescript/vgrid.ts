import { createGrid }  from './grid.js'

/**
 * Oben beide CommanderViews, unten, wenn eingeschaltet, der Viewer
 * @param gridContainer der beinhaltende Container
 * @param topView die obere Ansicht
 * @param bottomView die untere Ansicht
 * @param gridSplitter der Teiler
 * @param onChanged Callback, wird aufgerufen wenn die Aufteilung geändert wurde
 */
export function createVerticalGrid(
    gridContainer: HTMLDivElement, 
    topView: HTMLElement, 
    bottomView: HTMLElement, 
    gridSplitter: HTMLDivElement, 
    onChanged: ()=>void) {

    let topPercent = localStorage["vgrid"]
    if (!topPercent)
        topPercent = 70
    
    const grid = createGrid(gridContainer, topView, bottomView, gridSplitter, 
        (firstPercent) => {
            topPercent = firstPercent
            localStorage["vgrid"] = firstPercent
            onChanged()
        }, 
        true)

    grid.setSize(topPercent)
    switchBottom(false)

    /**
     * Ein/Ausblenden der unteren Ansicht
     */
    function switchBottom(preview: boolean) {
        if (preview) {
            bottomView.classList.remove("hidden")
            gridSplitter.classList.remove("hidden")
            topView.style.height = `calc(${topPercent}% - 3px)`
        } else {
            bottomView.classList.add("hidden")
            gridSplitter.classList.add("hidden")
            topView.style.height = "100%"
        }
    }
}


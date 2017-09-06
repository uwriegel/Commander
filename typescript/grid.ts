
class Grid {
    /**
     * Mechanismus zur variablen Aufteilung zweier Ansichten mit Hilfe eines Teilers
     * @param gridContainer der beinhaltende Container
     * @param firstView die erste Ansicht
     * @param secondView die zweite Ansicht
     * @param gridSplitter der Teiler
     * @param onChanged Callback, wird aufgerufen wenn die Aufteilung geändert wurde
     * @param isVertical Die Aufteilung erfolgt vertikal
     */
    constructor(private gridContainer: HTMLDivElement, 
        private firstView: HTMLElement, 
        private secondView: HTMLElement, 
        private gridSplitter: HTMLDivElement,
        onChanged?: (firstPercent: number)=>void, private isVertical?: boolean) {

        gridSplitter.addEventListener('mousedown', (evt) => {
            if (evt.which != 1)
                return
            let firstPercent: number
            const initialPosition = isVertical ? evt.pageY : evt.pageX
            const start = isVertical ? firstView.offsetHeight : firstView.offsetWidth

            const onmousemove = (evt: MouseEvent) => {
                const delta = (isVertical ? evt.pageY : evt.pageX) - initialPosition

                const position = start + delta
                firstPercent = position / ((isVertical ? gridContainer.offsetHeight : gridContainer.offsetWidth) - 6) * 100
                if (firstPercent < 4)
                    firstPercent = 4
                else if (firstPercent > 96)
                    firstPercent = 96
                this.setSize(firstPercent)

                evt.stopPropagation()
                evt.preventDefault()
            }

            const onmouseup = (evt: MouseEvent) => {
                window.removeEventListener('mousemove', onmousemove, true)
                window.removeEventListener('mouseup', onmouseup, true)
                evt.stopPropagation();
                evt.preventDefault();
                if (onChanged)
                    onChanged(firstPercent)
            }

            window.addEventListener('mousemove', onmousemove, true)
            window.addEventListener('mouseup', onmouseup, true)

            evt.stopPropagation()
            evt.preventDefault()
        }, true)
    }

    /**
     * Setzen der Größen der Elemente
     * @param firstPercent Prozentzahl der Größe des ersten Elements
     */
    setSize(firstPercent: number) {
        const secondPercent = 100 - firstPercent;
        this.gridSplitter.style[this.isVertical ? 'top' : 'left'] = `calc(${firstPercent}% - 3px)`
        this.firstView.style[this.isVertical ? 'height' : 'width'] = `calc(${firstPercent}% - 3px)`
        this.secondView.style[this.isVertical ? 'top' : 'left'] = `calc(${firstPercent}% + 3px)`
        this.secondView.style[this.isVertical ? 'height' : 'width'] = `calc(${secondPercent}% - 3px)`
    }
}

// function Gridddd()
// {


//     return {
//         setSize: setSize
//     }
// }

export { Grid }
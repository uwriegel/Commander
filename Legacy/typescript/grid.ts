/**
 * Mechanismus zur variablen Aufteilung zweier Ansichten mit Hilfe eines Teilers
 * @param gridContainer 
 * @param firstView die erste Ansicht
 * @param secondView die zweite Ansicht
 * @param gridSplitter der Teiler
 * @param onChanged Callback, wird aufgerufen wenn die Aufteilung geändert wurde
 * @param isVertical Die Aufteilung erfolgt vertikal
 */
export function createGrid(gridContainer: HTMLDivElement, 
    firstView: HTMLElement, 
    secondView: HTMLElement, 
    gridSplitter: HTMLDivElement,
    onChanged?: (firstPercent: number)=>void, 
    isVertical?: boolean) {
    gridSplitter.addEventListener('mousedown', evt => {
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
             setSize(firstPercent)

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

    function setSize(firstPercent: number) {
        const secondPercent = 100 - firstPercent;
        gridSplitter.style[isVertical ? 'top' : 'left'] = `calc(${firstPercent}% - 3px)`
        firstView.style[isVertical ? 'height' : 'width'] = `calc(${firstPercent}% - 3px)`
        secondView.style[isVertical ? 'top' : 'left'] = `calc(${firstPercent}% + 3px)`
        secondView.style[isVertical ? 'height' : 'width'] = `calc(${secondPercent}% - 3px)`
    }

    return {
        /**
         * Setzen der Größen der Elemente
         * @param firstPercent Prozentzahl der Größe des ersten Elements
         */
        setSize: setSize
    }
}


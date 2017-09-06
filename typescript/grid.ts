
// /**
//  * Mechanismus zur variablen Aufteilung zweier Ansichten mit Hilfe eines Teilers
//  * @param gridContainer der beinhaltende Container
//  * @param firstView die erste Ansicht
//  * @param secondView die zweite Ansicht
//  * @param gridSplitter der Teiler
//  * @param onChanged Callback, wird aufgerufen wenn die Aufteilung geändert wurde
//  * @param isVertical Die Aufteilung erfolgt vertikal
//  */
// function Grid(gridContainer: HTMLDivElement, firstView: HTMLElement, secondView: HTMLElement, gridSplitter: HTMLDivElement,
//     onChanged?: (firstPercent: number)=>void, isVertical?: boolean)
// {
//     gridSplitter.addEventListener('mousedown', function (evt)
//     {
//         if (evt.which != 1)
//             return
//         var firstPercent: number
//         var initialPosition = isVertical ? evt.pageY : evt.pageX
//         var start = isVertical ? firstView.offsetHeight : firstView.offsetWidth

//         function onmousemove(evt)
//         {
//             var delta = (isVertical ? evt.pageY : evt.pageX) - initialPosition

//             var position = start + delta
//             firstPercent = position / ((isVertical ? gridContainer.offsetHeight : gridContainer.offsetWidth) - 6) * 100
//             if (firstPercent < 4)
//                 firstPercent = 4
//             else if (firstPercent > 96)
//                 firstPercent = 96
//             setSize(firstPercent)

//             evt.stopPropagation();
//             evt.preventDefault();
//         }

//         function onmouseup(evt)
//         {
//             window.removeEventListener('mousemove', onmousemove, true);
//             window.removeEventListener('mouseup', onmouseup, true);
//             evt.stopPropagation();
//             evt.preventDefault = true;
//             if (onChanged)
//                 onChanged(firstPercent);
//         }

//         window.addEventListener('mousemove', onmousemove, true);
//         window.addEventListener('mouseup', onmouseup, true);

//         evt.stopPropagation()
//         evt.preventDefault()
//     }, true);

//     /**
//      * Setzen der Größen der Elemente
//      * @param firstPercent Prozentzahl der Größe des ersten Elements
//      */
//     function setSize(firstPercent: number)
//     {
//         var secondPercent = 100 - firstPercent;
//         gridSplitter.style[isVertical ? 'top' : 'left'] = `calc(${firstPercent}% - 3px)`
//         firstView.style[isVertical ? 'height' : 'width'] = `calc(${firstPercent}% - 3px)`
//         secondView.style[isVertical ? 'top' : 'left'] = `calc(${firstPercent}% + 3px)`
//         secondView.style[isVertical ? 'height' : 'width'] = `calc(${secondPercent}% - 3px)`
//     }

//     return {
//         setSize: setSize
//     }
// }


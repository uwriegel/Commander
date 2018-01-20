
// /**
//  * Rund drehendes Rad, das anzeigt, dass etwas im Hintergrund getan wird
//  */
// var WaitingItem = (() => {
//     /**
//      * Container, der das Waiting-Canvas enthält
//      */
//     var container: HTMLDivElement
//     var timeouter
//     var waitingTimeout
//     var onCancel: (cancelled: boolean) => void

//     /**
//      * Starten der Anzeige des Warterades
//      * @param timeout Zeit in Sekunden, nachdem die Aktion abgebrochen werden soll
//      * @param onCancel Callback bei Abbruch, wenn manuell mit Escape, ist cancelled gesetzt
//      */
//     function start(timeout: number, onCancelToSet: (cancelled: boolean) => void)
//     {
//         onCancel = onCancelToSet
//         if (container)
//             return

//         waitingTimeout = setTimeout(() =>
//         {
//             onCancel(false)
//         }, timeout * 1000);

//         document.addEventListener('keydown', escapeListener, true)

//         container = document.createElement('div')
//         container.classList.add("waitingItemContainer")
//         document.body.appendChild(container)
//         var waitingItem = document.createElement('canvas')
//         var width = container.offsetWidth
//         waitingItem.width = width
//         waitingItem.height = width

//         var context = waitingItem.getContext("2d")
//         context.fillStyle = '#000000'
//         context.strokeStyle = 'gray'
//         context.lineWidth = 5
//         context.lineCap = 'round'
//         context.translate(width / 2, width / 2)

//         var angle = 30
//         var startIndex = 360 / angle

//         if (timeouter)
//             clearInterval(timeouter)

//         container.appendChild(waitingItem)

//         timeouter = setInterval(function () {
//             context.clearRect(-width / 2, -width / 2, width, width)

//             if (startIndex < 0)
//                 startIndex = 360 / angle
//             var index = 0
//             for (var i = 360 / angle; i > 0 ; i--) {
//                 drawSegment(context, width / 2, i * angle, index++, startIndex)
//             }
//             startIndex--
//         }, 60)

//         setTimeout(function () {
//             if (container)
//                 container.classList.add('waitingItemVisible')
//         }, 20)
//     }

//     function stop(noAnimation)
//     {
//         document.removeEventListener('keydown', escapeListener, true)

//         if (waitingTimeout)
//         {
//             clearTimeout(waitingTimeout)
//             waitingTimeout = null
//         }
        
//         if (container) {
//             let thisContainer = container
//             let thisInterval = timeouter
//             container = null
//             thisContainer.classList.remove('waitingItemVisible')
//             if (noAnimation || container == null) {
//                 thisContainer.remove()
//                 clearInterval(thisInterval)
//             }
//             else
//                 thisContainer.addEventListener("webkitTransitionEnd", function endAni() {
//                     thisContainer.removeEventListener("webkitTransitionEnd", endAni, false)
//                     thisContainer.remove()
//                     if (thisInterval)
//                         clearInterval(thisInterval)
//                 }, false)
//         }
//     }

//     function drawSegment(context, length, angle, index, startIndex) {
//         switch (index - startIndex) {
//             case 0:
//                 context.strokeStyle = '#0000ff'
//                 break
//             case 1:
//                 context.strokeStyle = 'rgba(0, 0, 255, 0.77)'
//                 break
//             case 2:
//                 context.strokeStyle = 'rgba(0, 0, 255, 0.55)'
//                 break
//             case 3:
//                 context.strokeStyle = 'rgba(0, 0, 255, 0.40)'
//                 break
//             default:
//                 context.strokeStyle = 'rgba(0, 0, 255, 0.22)'
//                 break
//         }
//         context.save()
//         context.beginPath()
//         context.rotate(angle * Math.PI / 180)
//         context.moveTo(0, -20)
//         context.lineTo(0, -length + 20)
//         context.stroke()
//         context.closePath()
//         context.restore()
//     }

//     function escapeListener(evt: KeyboardEvent) 
//     {
//         if (evt.which == 27) // Esc
//         {
//             onCancel(true)
//             evt.preventDefault()
//             evt.stopPropagation()
//         }
//     }

//     return {
//         start: start,
//         stop: stop
//     }
// })()
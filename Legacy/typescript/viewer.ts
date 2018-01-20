
/**
 * Anzeige der Dateien unten in der Ansicht
 */
export function createViewer() {

    const viewer = <HTMLElement>document.getElementById("viewer")
    const img = <HTMLImageElement>document.getElementById("viewerImg")
    const video = <HTMLVideoElement>document.getElementById("viewerVideo")
    const frame = <HTMLIFrameElement>document.getElementById("viewerFrame")
    let lastFile: string
    let timer: number
    
    function selectionChanged(item: string)
    {
        if (viewer.classList.contains("displayNone")) {
            if (lastFile) {
                video.src = ""
                frame.src = ""
                img.src = ""
                lastFile = ""
            }
            return
        }

        if (lastFile == item)
            return
        lastFile = item;
        if (timer)
            clearTimeout(timer)

        timer = setTimeout(() => {
            if (item) {
                //let itemCoded = `/Commander/File?path=${btoa(item)}`
                const itemCoded = `/Commander/File?path=${btoa(encodeURIComponent(item))}`

                const itemcheck = item.toLowerCase()
                if (itemcheck.endsWith(".mp4") || itemcheck.endsWith(".mkv") || itemcheck.endsWith(".mp3") || itemcheck.endsWith(".wav")) {
                    img.classList.add("displayNone")
                    frame.classList.add("displayNone")
                    video.classList.remove("displayNone")
                    if (video.src != itemCoded)
                        video.src = itemCoded
                }
                else if (itemcheck.endsWith(".jpg") || itemcheck.endsWith(".png") || itemcheck.endsWith(".ico")) {
                    img.classList.remove("displayNone")
                    img.src = itemCoded
                    frame.classList.add("displayNone")
                    video.classList.add("displayNone")
                    video.pause()
                }
                else if (itemcheck.endsWith(".pdf") || itemcheck.endsWith("cs") || itemcheck.endsWith("html") || itemcheck.endsWith("xml")
                        || itemcheck.endsWith("java") || itemcheck.endsWith("xaml") || itemcheck.endsWith("java")
                        || itemcheck.endsWith("js") || itemcheck.endsWith("css")) {
                    img.classList.add("displayNone")
                    video.classList.add("displayNone")
                    video.pause()
                    frame.classList.remove("displayNone")
                    frame.src = itemCoded
                }
                else {
                    img.classList.add("displayNone")
                    video.classList.add("displayNone")
                    video.pause()
                    frame.classList.add("displayNone")
                }
            }
            else {
                img.classList.add("displayNone")
                video.classList.add("displayNone")
                video.pause()
                frame.classList.add("displayNone")
            }
        }, 50)
    }

    return { selectionChanged: selectionChanged }
}


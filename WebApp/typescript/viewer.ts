
/**
 * Anzeige der Dateien unten in der Ansicht
 */
class Viewer
{
    constructor()
    {
        this.viewer = <HTMLElement>document.getElementById("viewer")
        this.img = <HTMLImageElement>document.getElementById("viewerImg")
        this.video = <HTMLVideoElement>document.getElementById("viewerVideo")
        this.frame = <HTMLIFrameElement>document.getElementById("viewerFrame")
    }

    selectionChanged(item?: string)
    {
        if (this.viewer.classList.contains("displayNone"))
        {
            if (this.lastFile)
            {
                this.video.src = null
                this.frame.src = null
                this.img.src = null
                this.lastFile = null
            }
            return
        }

        if (this.lastFile == item)
            return
        this.lastFile = item;
        if (this.timer)
            clearTimeout(this.timer)

        this.timer = setTimeout(() =>
        {
            if (item)
            {
                //let itemCoded = `/Commander/File?path=${btoa(item)}`
                let itemCoded = `/Commander/File?path=${btoa(encodeURIComponent(item))}`

                let itemcheck = item.toLowerCase()
                if (itemcheck.endsWith(".mp4") || itemcheck.endsWith(".mkv") || itemcheck.endsWith(".mp3") || itemcheck.endsWith(".wav"))
                {
                    this.img.classList.add("displayNone")
                    this.frame.classList.add("displayNone")
                    this.video.classList.remove("displayNone")
                    if (this.video.src != itemCoded)
                        this.video.src = itemCoded
                }
                else if (itemcheck.endsWith(".jpg") || itemcheck.endsWith(".png") || itemcheck.endsWith(".ico"))
                {
                    this.img.classList.remove("displayNone")
                    this.img.src = itemCoded
                    this.frame.classList.add("displayNone")
                    this.video.classList.add("displayNone")
                    this.video.pause()
                }
                else if (itemcheck.endsWith(".pdf") || itemcheck.endsWith("cs") || itemcheck.endsWith("html") || itemcheck.endsWith("xml")
                    || itemcheck.endsWith("java") || itemcheck.endsWith("xaml") || itemcheck.endsWith("java")
                    || itemcheck.endsWith("js") || itemcheck.endsWith("css"))
                {
                    this.img.classList.add("displayNone")
                    this.video.classList.add("displayNone")
                    this.video.pause()
                    this.frame.classList.remove("displayNone")
                    this.frame.src = itemCoded
                }
                else
                {
                    this.img.classList.add("displayNone")
                    this.video.classList.add("displayNone")
                    this.video.pause()
                    this.frame.classList.add("displayNone")
                }
            }
            else
            {
                this.img.classList.add("displayNone")
                this.video.classList.add("displayNone")
                this.video.pause()
                this.frame.classList.add("displayNone")
            }
        }, 50)
    }

    private viewer
    private img
    private video
    private frame
    private lastFile: string
    private timer: number
}
    


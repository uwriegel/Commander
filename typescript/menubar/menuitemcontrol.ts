
export class MenuItemControl {
    constructor(private checker: HTMLSpanElement | undefined){}

    get isChecked() {
        return this.checker ? !this.checker!.classList.contains("hidden") : false
    }

    set isChecked(value: boolean) {
        if (this.checker) {
            if (value)
                this.checker!.classList.remove("hidden")
            else
                this.checker!.classList.add("hidden")
        }
    }
}
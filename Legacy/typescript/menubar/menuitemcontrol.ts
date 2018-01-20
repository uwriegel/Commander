
export interface MenuItemSelector {
    isSelected: ()=>boolean
    setSelection: (calue: boolean)=>void
}

export function createMenuItemSelector(checker: HTMLSpanElement | undefined) {
    function isSelected() {
        return checker ? !checker!.classList.contains("hidden") : false
    }

    function setSelection(value: boolean) {
        if (checker) {
            if (value)
                checker!.classList.remove("hidden")
            else
                checker!.classList.add("hidden")
        }
    }

    return {
        isSelected: isSelected,
        setSelection: setSelection
    }
}
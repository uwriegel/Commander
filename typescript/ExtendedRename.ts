/**
 * Ansicht der ExtendedRename-Konfigurationseinstellungen
 */
class ExtendedRename implements ISelectionChanged
{
    constructor(parent: HTMLParagraphElement, itemsModel: IModel, observator: IObservator, endDialog: (dialogResult: DialogResult) => any)
    {
        this.endDialog = endDialog
        this.itemsModel = itemsModel
        this.observator = observator
        var extendedRenameTemplate = (<HTMLTemplateElement>document.getElementById('extendedRenameTemplate')).content.querySelector('div')
        var extendedRenameDiv = <HTMLElement>extendedRenameTemplate.cloneNode(true);
        parent.appendChild(extendedRenameDiv)

        var params = localStorage['ExtendedRenameParams']
        if (params)
            this.params = JSON.parse(params)
        else
            this.params = { digits: 3, prefix: "Bild", initialValue: 1}
    }

    get isEnabled(): Boolean
    {
        return
    }

    get Columns(): ColumnsControl 
    {
        return this._Columns
    }
    set Columns(value: ColumnsControl)
    {
        this._Columns = value
    }
    private _Columns: ColumnsControl

    initializeParameters()
    {
        var prefix = <HTMLInputElement>document.getElementById('prefix')
        this.params.prefix = prefix.value

        var initialValue = <HTMLInputElement>document.getElementById('initial')
        this.params.initialValue = Number(initialValue.value)

        var digitsElement = <HTMLInputElement>document.getElementById('digits')
        this.params.digits = Number(digitsElement.value)
        var pad = "0".repeat(this.params.digits)

        this.pad = function (val: number)
        {
            var str = val.toString()
            return pad.substring(0, pad.length - str.length) + str
        }

        localStorage['ExtendedRenameParams'] = JSON.stringify(this.params)
    }

    onShow()
    {
        var prefix = <HTMLInputElement>document.getElementById('prefix')
        prefix.value = this.params.prefix
        prefix.onfocus = evt => prefix.select()
        this.focusableElements.push(prefix)

        var initial = <HTMLInputElement>document.getElementById('initial')
        initial.value = <string><any>this.params.initialValue
        initial.onfocus = evt => initial.select()
        this.focusableElements.push(initial)

        var digits = <HTMLInputElement>document.getElementById('digits')
        digits.value = <string><any>this.params.digits
        this.focusableElements.push(digits)

        this.focusableElements.push(<HTMLElement>document.getElementsByClassName('dialogButton')[0])
        this.focusableElements.push(<HTMLElement>document.getElementsByClassName('dialogButton')[1])
        this.focusableElements[0].focus();
    }

    selectionChanged()
    {
        var allItems = this.itemsModel.getItemSource()
        allItems.forEach((n, i) => n.renamedName = null)

        var sellies = this.itemsModel.getSelectedItems()
        sellies.forEach((n, i) => n.renamedName = `${this.params.prefix}${this.pad(i + this.params.initialValue)}`)

        this.observator.updateItems()
    }

    keydown(evt: KeyboardEvent)
    {
        switch (evt.which)
        {
            case 9: // TAB
                var active = document.activeElement
                if (evt.shiftKey)
                {
                    if (active == this.focusableElements[0])
                        this.focusableElements[4].focus();
                    else if (active == this.focusableElements[1])
                        this.focusableElements[0].focus();
                    else if (active == this.focusableElements[2])
                        this.focusableElements[1].focus();
                    else if (active == this.focusableElements[3])
                        this.focusableElements[2].focus();
                    else if (active == this.focusableElements[4])
                        this.focusableElements[3].focus();
                }
                else
                {
                    if (active == this.focusableElements[0])
                        this.focusableElements[1].focus();
                    else if (active == this.focusableElements[1])
                        this.focusableElements[2].focus();
                    else if (active == this.focusableElements[2])
                        this.focusableElements[3].focus();
                    else if (active == this.focusableElements[3])
                        this.focusableElements[4].focus();
                    else if (active == this.focusableElements[4])
                        this.focusableElements[0].focus();
                }
                break;
            case 13: // Enter
                this.endDialog(DialogResult.OK)
                break;
            case 27: // ESC
                this.endDialog(DialogResult.Cancel)
                break
            default:
                return;
        }
        evt.preventDefault();
        evt.stopPropagation();
    }

    async execute(directory: string, items: Item[])
    {
        return await Connection.extendedRename(directory, items)
    }

    private pad: (number)=>string

    private endDialog: (dialogResult: DialogResult) => any
    private focusableElements: HTMLElement[] = []
    private itemsModel: IModel
    private observator: IObservator
    private params: ExtendedRenameParams
}
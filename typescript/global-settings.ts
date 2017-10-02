export class GlobalSettings {
    static get showHidden() { return GlobalSettings._showHidden }
    static set showHidden(value: boolean) { GlobalSettings._showHidden = value }
    private static _showHidden = false
}
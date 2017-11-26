import { RootItem } from "./model/root-item"

export function getDrives() {
    return invoke<RootItem[]>("getDrives")
}

//function invoke<T>(method: string, param?: string) {
function invoke<T>(method: string) {
    return new Promise<T>(resolve => {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onload = _ => {
            var result = <T>JSON.parse(xmlhttp.responseText);
            resolve(result)
        }
        xmlhttp.open('GET', `cmd/${method}`, true)
        xmlhttp.send()
    })
}
    
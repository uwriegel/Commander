import { RootItem } from "./model/root-item.js"
import { DirectoryItem } from "./model/directory-item.js"

export const getDrives = () => invoke<RootItem[]>("getDrives")
export const getItems = (path: string) => invoke<DirectoryItem[]>("getItems", {path: path})
export const exit = () => invoke("exit")

function invoke<T>(method: string, param?: any) {
    return new Promise<T>(resolve => {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onload = _ => {
            var result = <T>JSON.parse(xmlhttp.responseText);
            resolve(result)
        }

        xmlhttp.open('GET', param? `cmd/${method}?${Object.keys(param).map(n => n + '=' + param[n]).join('&')}` : `cmd/${method}`, true)
        xmlhttp.send()
    })
}
    
const socket = new WebSocket(`ws://localhost:${location.port}/Socke`)


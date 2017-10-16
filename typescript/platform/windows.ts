import * as Path from 'path'
import { Response } from "express"
import { DirectoryItem } from '../model/directory-item'
import { Platform } from './platform'
import { Item } from '../model/item'
export { Platform } from './platform'

import * as addon from 'commander_native';

export class Windows extends Platform {
    
    async getFiles(path: string) {
        if (!path.endsWith('\\'))
            path += '\\'
        return new Promise<DirectoryItem[]>(resolve => {
            addon.getFiles(path, (err, res) => {
                if (err)
                    resolve([])
                else {
                    const result = res.map(n => {
                        return {
                            displayName: n.displayName,
                            isHidden: n.isHidden,
                            size: n.size,
                            date: n.time,
                            isDirectory: n.isDirectory                                              
                        }
                    })
                    resolve(result)
                }
            })
        })
    }    

    sendIconResponse(extension: string, response: Response) {
        addon.getIcon(extension, (_, res) => {
            response.setHeader("Content-type", "image/png")
            response.send(res)
        })
    }        

    async getVersions(path: string, items: Item[]) {
        const versionItems = items.filter(item => item.displayName.endsWith(".exe") || item.displayName.endsWith(".dll")).map(n => n.displayName)
        const result = await this.getVersionInfos(path, versionItems)
        return result.map((version, i) => {
            return {
                file: versionItems[i],
                version: version
            }
        })
    }

    protected internalGetIconUrl(item: DirectoryItem) {
        const ext = Path.extname(item.displayName)    
        return ext ? `http://localhost:20001/icon?ext=.${ext}` : "images/fault.png"
    }

    private getVersionInfos(path: string, versionItems: string[]) {
        return new Promise<string[]>(resolve => addon.getExtendedInfos(path, versionItems, (_, res) => resolve(res)))
    }
}
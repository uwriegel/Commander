import * as Path from 'path'
import { Response } from "express"
import { DirectoryItem } from '../model/directory-item'
import { Platform } from './platform'
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

    sendIconResponse(_: string, response: Response) {
        response.sendFile(Path.join(__dirname, "../fault.png"))
    }        

    protected internalGetIconUrl(_: DirectoryItem) {
        return "images/drive.png"
    }
}
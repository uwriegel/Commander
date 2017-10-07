import * as Path from 'path'
import * as fs from 'fs'
import { Platform } from './platform'
import { DirectoryItem } from '../model/directory-item'
import { RootItem } from '../model/root-item'

export class Linux extends Platform
{
    getInitialRootItems() {
        return new Promise<RootItem[]>((res, _) => res([ {
                displayName: 'Home',
                description: "Persönlicher Ordner",
                size: -1,
                path: '~',
                isDirectory: true
            }
        ]))
    }

    protected internalGetIconUrl(item: DirectoryItem) {
        const ext = Path.extname(item.displayName)    
        return ext ? `http://localhost:20001/icon?ext=${ext}` : "images/fault.png"
    }

    async getFileInfos(path: string, fileName: string)
    {
        const file = Path.join(path, fileName)
        return new Promise<DirectoryItem>(resolve => {
            fs.stat(file, (err, stats) => {
                if (err)
                    resolve({
                        displayName: fileName,
                        isHidden: !(fileName == '..') && fileName.startsWith('.'),
                        size: 0,
                        date: new Date(),
                        isDirectory: false                                              
                    })
                else {
                    resolve({
                        displayName: fileName,
                        isHidden: !(fileName == '..') && fileName.startsWith('.'),
                        size: stats.size,
                        date: stats.ctime,
                        isDirectory: stats.isDirectory()                                              
                    })
                }
            })
        })
    }
}
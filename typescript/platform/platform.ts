import * as Path from 'path'
import * as fs from 'fs'
import { DirectoryItem } from '../model/directory-item'
import { RootItem } from '../model/root-item'

export abstract class Platform
{
    getInitialRootItems() {
        return new Promise<RootItem[]>(res => res([]))
    }
    
    getAdditionalRootItems() {
        return new Promise<RootItem[]>(res => res([]))
    }

    getIconUrl(item: DirectoryItem) : string {
        if (item && item.isDirectory)
            return "images/folder.png"
        else if (!item)
            return "images/fault.png"
        else
            return this.internalGetIconUrl(item)
    }

    async getFiles(path: string) {
        const result = (await this.readDir(path))
        return await Promise.all(result.map(async file => await this.getFileInfos(path, file)))
    }

    async getFileInfos(path: string, fileName: string) {
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

    protected abstract internalGetIconUrl(item: DirectoryItem) : string 
        
    private async readDir(path: string) {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err)
                    reject(err)
                else
                    resolve(files)
            })
        })
    }
}


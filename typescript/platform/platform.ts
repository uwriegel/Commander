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

    async getFileInfos(_: string, fileName: string) {
        return new Promise<DirectoryItem>(resolve => {
            resolve({
                displayName: fileName,
                size: 0,
                date: new Date(),
                isDirectory: false                                              
            })
        })
    }
}


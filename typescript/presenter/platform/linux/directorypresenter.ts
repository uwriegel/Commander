import { DirectoryPresenter as DirectoryPresenterBase } from '../../directory-presenter.js'
import { DirectoryItem } from '../../../model/directory-item.js'
import { ColumnsControl }  from '../../../columnscontrol.js'
const fs = require('fs')
const Path = require('path')

export class DirectoryPresenter extends DirectoryPresenterBase {
    constructor() {
        super()
    }

    protected setColumns(): void {
        this.view.setColumns(new ColumnsControl(["Name", "Erw.", "Datum", "Größe", ""], "6"))
    }

    protected async getFiles(path: string) {
        const result = (await this.readDir(path))
        return await Promise.all(result.map(async file => await this.getFileInfos(path, file)))
    }

    private async readDir(path: string) {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (err: any, files: any) => {
                if (err)
                    reject(err)
                else
                    resolve(files)
            })
        })
    }    

    async getFileInfos(path: string, fileName: string) {
        const file = Path.join(path, fileName)
        return new Promise<DirectoryItem>(resolve => {
            fs.stat(file, (err: any, stats: any) => {
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
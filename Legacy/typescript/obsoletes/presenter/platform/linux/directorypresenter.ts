// import { DirectoryPresenter as DirectoryPresenterBase } from '../../directory-presenter.js'
// import { DirectoryItem } from '../../../model/directory-item.js'
// import { createColumnsControl }  from '../../../columnscontrol.js'
// // const fs = require('fs')
// // const Path = require('path')

// export class DirectoryPresenter extends DirectoryPresenterBase {
//     constructor() {
//         super()
//     }

//     protected setColumns(): void {
//         this.view.setColumns(createColumnsControl(["Name", "Erw.", "Datum", "Größe", ""], "6"))
//     }

//     protected async getFiles(path: string) {
//         const result = (await this.readDir(path))
//         return await Promise.all(result.map(async file => await this.getFileInfos(path, file)))
//     }

//     protected extendedGetIconUrl(item: DirectoryItem) {
// //        const ext = Path.extname(item.displayName)    
//         const ext = item
//         return ext ? `http://localhost:20000/icon?ext=${ext}` : "assets/images/fault.png"
//     }

//     private async readDir(_: string) {
//         return new Promise<string[]>((_, __) => {
//     // private async readDir(path: string) {
//     //     return new Promise<string[]>((resolve, reject) => {
//             // fs.readdir(path, (err: any, files: any) => {
//             //     if (err)
//             //         reject(err)
//             //     else
//             //         resolve(files)
//             // })
//         })
//     }    

//     private async getFileInfos(_: string, __: string) {
// //        private async getFileInfos(path: string, fileName: string) {
//   //      const file = Path.join(path, fileName)
//         return new Promise<DirectoryItem>(_ => {
//             // fs.stat(file, (err: any, stats: any) => {
//             //     if (err)
//             //         resolve({
//             //             displayName: fileName,
//             //             isHidden: !(fileName == '..') && fileName.startsWith('.'),
//             //             size: 0,
//             //             date: new Date(),
//             //             isDirectory: false                                              
//             //         })
//             //     else {
//             //         resolve({
//             //             displayName: fileName,
//             //             isHidden: !(fileName == '..') && fileName.startsWith('.'),
//             //             size: stats.size,
//             //             date: stats.ctime,
//             //             isDirectory: stats.isDirectory()                                              
//             //         })
//             //     }
//             // })
//         })
//     }
// }
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
                isDirectory: true
            }
        ]))
    }

    map(items: DirectoryItem[]) : DirectoryItem[] {
        return items.map(i => { 
            i.isHidden = !(i.displayName == '..') && i.displayName.startsWith('.')
            return i
        })
    }
}
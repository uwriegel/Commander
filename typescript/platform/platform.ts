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

    map(items: DirectoryItem[]) : DirectoryItem[] {
        return items
    }
}


import { RootItem } from '../presenter/rootpresenter'
export { RootItem } from '../presenter/rootpresenter'

export abstract class Platform
{
    getInitialRootItems() {
        return new Promise<RootItem[]>(res => res([]))
    }
    getAdditionalRootItems() {
        return new Promise<RootItem[]>(res => res([]))
    }
}


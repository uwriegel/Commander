import { RootItem, Platform } from './platform'
export { RootItem, Platform } from './platform'

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
}
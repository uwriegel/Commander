import { Item } from './item'

export interface RootItem extends Item {
    description: string
    size: number,
    path: string
}

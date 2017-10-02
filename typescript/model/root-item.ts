import { Item } from './item'

export interface RootItem extends Item
{
    displayName: string
    description: string
    size: number,
    path: string
}

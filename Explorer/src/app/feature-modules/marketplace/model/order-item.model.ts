export interface OrderItem{
    itemId: string,
    name: string,
    price: number,
    type: ItemType
}

export enum ItemType {
    Tour = 'Tour',
}
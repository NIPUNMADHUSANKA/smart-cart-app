export type ItemStatus = 'active' | 'archived';
export type PriorityStatus = 'normal' | 'low' | 'medium' | 'high';

export class ShoppingItem {
    itemId!: String;
    itemName!: String;
    description!: String;
    quantity!: String;
    unit!: String;
    status!: ItemStatus;
    categoryId!: String;
    priority!: PriorityStatus;
    createdAt!: Date;
    updatedAt!: Date;
}

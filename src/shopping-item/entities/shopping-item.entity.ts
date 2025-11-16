export type ItemStatus = 'active' | 'archived';
export type PriorityStatus = 'normal' | 'low' | 'medium' | 'high';
export type UnitStatus =
  | 'kg'
  | 'piece'
  | 'pack'
  | 'dozen'
  | 'box'
  | 'gram'
  | 'litre'
  | 'milliLitre'
  | 'bottle'
  | 'can'
  | 'cup'
  | 'other';

export class ShoppingItem {
  itemId!: string;
  itemName!: string;
  description!: string;
  quantity!: number;
  unit!: UnitStatus;
  status!: ItemStatus;
  categoryId!: string;
  priority!: PriorityStatus;
  createdAt!: Date;
  updatedAt!: Date;
}

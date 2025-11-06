export type CategoryStatus = 'active' | 'completed';
export type PriorityStatus = 'normal' | 'low' | 'medium' | 'high';

export class Category {
  categoryId!: string;
  categoryName!: string;
  description!: string;
  status!: CategoryStatus;
  userId!: string;
  icon!: string;
  priority!: PriorityStatus;
  createdAt!: Date;
  updatedAt!: Date;
}

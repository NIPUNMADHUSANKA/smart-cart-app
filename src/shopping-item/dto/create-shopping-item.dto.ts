import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ItemStatus {
  active = 'active',
  archived = 'archived',
}

export enum PriorityStatus {
  normal = 'normal',
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum UnitStatus {
  kg = 'kg',
  piece = 'piece',
  pack = 'pack',
  dozen = 'dozen',
  box = 'box',
  gram = 'gram',
  litre = 'litre',
  milliLitre = 'milliLitre',
  bottle = 'bottle',
  can = 'can',
  cup = 'cup',
  other = 'other',
}

export class CreateShoppingItemDto {
  @IsString()
  @IsNotEmpty()
  itemName!: string;

  @IsInt()
  @IsNotEmpty()
  quantity!: number;

  @IsEnum(UnitStatus)
  unit!: UnitStatus;

  @IsEnum(ItemStatus)
  status!: ItemStatus;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsEnum(PriorityStatus)
  priority!: PriorityStatus;

  @IsString()
  @IsOptional()
  description?: string;
}

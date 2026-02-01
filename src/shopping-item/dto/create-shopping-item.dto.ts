import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ItemStatus, PriorityStatus, UnitStatus } from '@prisma/client';

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

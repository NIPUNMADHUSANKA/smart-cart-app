import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum CategoryStatus {
  active = 'active',
  completed = 'completed',
}

export enum CategoryPriority {
  normal = 'normal',
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export class CreateCategoryDto {

  @IsString()
  @IsNotEmpty()
  categoryName!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CategoryStatus)
  status!: CategoryStatus;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsEnum(CategoryPriority)
  priority!: CategoryPriority;
}
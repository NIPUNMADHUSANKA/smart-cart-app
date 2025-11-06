import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryId;

  @IsString()
  @IsNotEmpty()
  categoryName;

  @IsEnum(['active', 'completed'])
  status;

  @IsString()
  @IsNotEmpty()
  userId;

  @IsString()
  @IsOptional()
  icon;

  @IsEnum(['normal', 'low', 'medium', 'high'])
  priority;
}

import { IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateShoppingItemDto {
  
    @IsString()
    @IsNotEmpty()
    itemName

    @IsString()
    @IsNotEmpty()
    quantity

    @IsString()
    @IsNotEmpty()
    unit

    @IsEnum(['active', 'archived'])
    status
  
    @IsString()
    @IsNotEmpty()
    categoryId

    @IsEnum(['normal', 'low', 'medium', 'high'])
    priority
}

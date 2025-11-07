import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';

@Controller('shopping-item')
export class ShoppingItemController {
  constructor(private readonly shoppingItemService: ShoppingItemService) {}

  @Post()
  create(@Body(ValidationPipe) createShoppingItemDto: CreateShoppingItemDto) {
    return this.shoppingItemService.create(createShoppingItemDto);
  }

  @Get()
  findAll() {
    return this.shoppingItemService.findAll();
  }

  @Get(':itemId')
  findOne(@Param('itemId') itemId: string) {
    return this.shoppingItemService.findOne(itemId);
  }

  @Get('/findByCategory/:categoryId')
  findShoppingItemByCategory(@Param('categoryId') categoryId: string) {
    return this.shoppingItemService.findShoppingItemByCategory(categoryId);
  }

  @Patch(':itemId')
  update(@Param('itemId') itemId: string, @Body(ValidationPipe) updateShoppingItemDto: UpdateShoppingItemDto) {
    return this.shoppingItemService.update(itemId, updateShoppingItemDto);
  }

  @Delete(':itemId')
  remove(@Param('itemId') itemId: string) {
    return this.shoppingItemService.remove(itemId);
  }
}

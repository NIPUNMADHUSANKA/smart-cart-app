import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Request, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('shopping-item')
export class ShoppingItemController {
  constructor(private readonly shoppingItemService: ShoppingItemService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body(ValidationPipe) createShoppingItemDto: CreateShoppingItemDto) {
    return await this.shoppingItemService.create(createShoppingItemDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() request) {
    const userId = request.user.userId;
    return await this.shoppingItemService.findAll(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':itemId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('itemId', new ParseUUIDPipe({ version: '4' })) itemId: string, @Request() request) {
    const userId = request.user.userId;
    return await this.shoppingItemService.findOne(itemId, userId);
  }

  @UseGuards(AuthGuard)
  @Get('/findByCategory/:categoryId')
  @HttpCode(HttpStatus.OK)
  async findShoppingItemByCategory(@Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string, @Request() request) {
    const userId = request.user.userId;
    return await this.shoppingItemService.findShoppingItemByCategory(categoryId, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':itemId')
  @HttpCode(HttpStatus.OK)
  async update(@Param('itemId', new ParseUUIDPipe({ version: '4' })) itemId: string, @Request() request, @Body(ValidationPipe) updateShoppingItemDto: UpdateShoppingItemDto) {
    const userId = request.user.userId;
    return await this.shoppingItemService.update(itemId, updateShoppingItemDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('itemId', new ParseUUIDPipe({ version: '4' })) itemId: string, @Request() request) {
    const userId = request.user.userId;
    return await this.shoppingItemService.remove(itemId, userId);
  }
}

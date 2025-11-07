import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShoppingItem } from './entities/shopping-item.entity';
import { Prisma } from 'generated/prisma/browser';

@Injectable()
export class ShoppingItemService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createShoppingItemDto: CreateShoppingItemDto): Promise<ShoppingItem> {
    try {
      return await this.databaseService.shoppingItem.create({
        data: createShoppingItemDto as unknown as Prisma.ShoppingItemCreateInput
      });
    } catch (error) {
      throw new HttpException("Internal Server Error with Shopping Item", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<ShoppingItem[]> {
    return await this.databaseService.shoppingItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findShoppingItemByCategory(categoryId: string): Promise<ShoppingItem[]> {
    const shoppingItems = await this.databaseService.shoppingItem.findMany({
      where: {
        categoryId: categoryId
      }
    });
    if (shoppingItems.length === 0) {
      throw new NotFoundException(`Category '${categoryId}' not found.`);
    }
    return shoppingItems;
  }

  async findOne(itemId: string): Promise<ShoppingItem | null> {
    const shoppingItem = await this.databaseService.shoppingItem.findUnique({
      where: {
        itemId: itemId
      }
    });
    if (!shoppingItem) {
      throw new NotFoundException(`Shopping Item '${itemId}' not found.`);
    }
    return shoppingItem;
  }

  async update(itemId: string, updateShoppingItemDto: UpdateShoppingItemDto): Promise<ShoppingItem | undefined> {
    try {
      return await this.databaseService.shoppingItem.update({
        where: { itemId },
        data: updateShoppingItemDto
      });
    } catch (error) {
    }
  }

  async remove(itemId: string): Promise<ShoppingItem | undefined> {
    try {
      return await this.databaseService.shoppingItem.delete({
        where: { itemId }
      });
    } catch (error) {
    }
  }
}

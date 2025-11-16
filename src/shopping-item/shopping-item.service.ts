import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShoppingItem } from './entities/shopping-item.entity';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ShoppingItemService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(input: CreateShoppingItemDto): Promise<ShoppingItem> {
    try {
      return await this.databaseService.shoppingItem.create({
        data: {
        itemName: input.itemName,
        description: input.description,
        quantity: input.quantity,
        unit: input.unit,
        status: input.status,
        priority: input.priority,
        category: {connect: {categoryId: input.categoryId}}
        } as Prisma.ShoppingItemCreateInput 
      });
    } catch (e: any) {
      if(e instanceof Prisma.PrismaClientKnownRequestError){
        if(e.code === 'P2002') throw new BadRequestException('Shopping Item already exists');
      }
      if(e instanceof Prisma.PrismaClientValidationError){
        throw new BadRequestException('Invalid Shopping Item payload (missing or wrong field types).');
      }
      throw new InternalServerErrorException("Failed to create Shopping Item");
    }
  }

  async findAll(userId): Promise<ShoppingItem[]> {
    return await this.databaseService.shoppingItem.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        category:{
           userId
        }
      }
    });
  }

  async findOne(itemId: string, userId: string): Promise<ShoppingItem | null> {
    const shoppingItem = await this.databaseService.shoppingItem.findUnique({
      where: {
        itemId: itemId,
        category:{
          userId
        }
      }
    });
    if (!shoppingItem) {
      throw new NotFoundException(`Shopping Item '${itemId}' not found.`);
    }
    return shoppingItem;
  }

  async findShoppingItemByCategory(categoryId: string, userId: string): Promise<ShoppingItem[] | null> {
    const shoppingItems = await this.databaseService.shoppingItem.findMany({
      where: {
        categoryId: categoryId,
        category: {
          userId
        }
      }
    });
    if (shoppingItems.length === 0) {
      throw new NotFoundException(`Category '${categoryId}' not found.`);
    }
    return shoppingItems;
  }

  async update(itemId: string, updateShoppingItemDto: UpdateShoppingItemDto, userId:string): Promise<ShoppingItem> {
    try {
      const {count} = await this.databaseService.shoppingItem.updateMany({
        where: { 
          itemId,
          category: { userId }
        },
        data: updateShoppingItemDto
      });

      if (count === 0) {
        throw new NotFoundException(`Shopping Item '${itemId}' not found`);
      }

      const updated = await this.databaseService.shoppingItem.findUnique({
        where: {
          itemId
        }
      });
      if (!updated) {
        throw new NotFoundException(`Shopping Item '${itemId}' not found after update.`);
      }
      return updated;

    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid Shopping Item update payload (missing or wrong field types).');
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Unique constraint violation while updating Shopping Item');
      }
      throw new InternalServerErrorException('Failed to update Shopping Item');
    }
  }


  async remove(itemId: string, userId: string): Promise<void> {
    try {
      const result = await this.databaseService.shoppingItem.deleteMany({
        where: { 
          itemId,
          category: { userId }
        }
      });
      if (result.count === 0) {
        throw new NotFoundException(`Shopping Item '${itemId}' not found.`);
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid request to delete Shopping Item.');
      }
      throw new InternalServerErrorException('Failed to delete Shopping Item');
    }
  }
}

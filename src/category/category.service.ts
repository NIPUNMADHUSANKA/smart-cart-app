import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma, Category as PrismaCategory } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(input: CreateCategoryDto & { userId }): Promise<PrismaCategory> {
    try {
      return await this.databaseService.category.create({
        data: {
          categoryName: input.categoryName,
          description: input.description,
          status: input.status,
          icon: input.icon,
          priority: input.priority,
          userId: input.userId,
        } as Prisma.CategoryCreateInput
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new BadRequestException('Category already exists');
      }
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid category payload (missing or wrong field types).');
      }
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll(userId: string): Promise<PrismaCategory[]> {
    return await this.databaseService.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(categoryId: string, userId: string): Promise<PrismaCategory | null> {
    const category = await this.databaseService.category.findUnique({
      where: {
        categoryId: categoryId,
        userId: userId
      },
    });
    if (!category) {
      throw new NotFoundException(`Category '${categoryId}' not found.`);
    }
    return category;
  }

  async update(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string
  ): Promise<PrismaCategory> {
    try {
      const { count } = await this.databaseService.category.updateMany({
        where: { categoryId, userId },
        data: updateCategoryDto,
      });

      if (count === 0) {
        throw new NotFoundException(`Category '${categoryId}' not found`);
      }

      const updated = await this.databaseService.category.findUnique({ where: { categoryId } });
      if (!updated) {
        throw new NotFoundException(`Category '${categoryId}' not found`);
      }
      return updated;
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid category update payload (missing or wrong field types).');
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Unique constraint violation while updating category');
      }
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(categoryId: string, userId: string): Promise<void> {
    try {
      const { count } = await this.databaseService.category.deleteMany({
        where: {
          categoryId,
          userId
        }
      })
      if (count === 0) throw new NotFoundException('Category not found');

    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Category not found');
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}

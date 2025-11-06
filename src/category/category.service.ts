import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from '../database/database.service';
import type { Prisma, Category as PrismaCategory } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<PrismaCategory> {
    try {
      return await this.databaseService.category.create({
        data: createCategoryDto as unknown as Prisma.CategoryCreateInput,
      });
    } catch (e) {
      throw new Error("Category with these details already exists.");
    }
  }

  async findAll(): Promise<PrismaCategory[]> {
    return await this.databaseService.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(categoryId: string): Promise<PrismaCategory | null> {
    const category = await this.databaseService.category.findUnique({
      where: {
        categoryId: categoryId,
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
  ): Promise<PrismaCategory | undefined> {
    try {
      return await this.databaseService.category.update({
        where: { categoryId },
        data: updateCategoryDto,
      });
    } catch (e) {
    }
  }

  async remove(categoryId: string): Promise<PrismaCategory | undefined> {
    try {
      return await this.databaseService.category.delete({
        where: { categoryId },
      });
    } catch (e) {

    }
  }
}
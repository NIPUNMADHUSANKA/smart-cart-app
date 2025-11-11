import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma, Category as PrismaCategory } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(input: CreateCategoryDto & {userId}): Promise<PrismaCategory> {
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
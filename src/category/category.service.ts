import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createCategoryDto: Prisma.CategoryCreateInput) {
    return this.databaseService.category.create({
      data: createCategoryDto
    });
  }

  async findAll() {
    return this.databaseService.category.findMany();
  }

  async findOne(categoryId: string) {
    return this.databaseService.category.findUnique({
      where:{
        categoryId : categoryId
      } 
    });
  }

  update(categoryId: string, updateCategoryDto: UpdateCategoryDto) {
    return this.databaseService.category.update({
      where: {
        categoryId: categoryId
      },
      data: updateCategoryDto
    });
  }

  remove(categoryId: string) {
    return this.databaseService.category.delete({
      where:{
        categoryId: categoryId
      }
    });
  }
}

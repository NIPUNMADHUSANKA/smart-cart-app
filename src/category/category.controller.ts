import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':categoryId')
  findOne(@Param('categoryId') categoryId: string) {
    return this.categoryService.findOne(categoryId);
  }

  @Patch(':categoryId')
  update(@Param('categoryId') categoryId: string, @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(categoryId, updateCategoryDto);
  }

  @Delete(':categoryId')
  remove(@Param('categoryId') categoryId: string) {
    return this.categoryService.remove(categoryId);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto, @Request() request) {
    const userId = request.user.userId;
    return await this.categoryService.create({ ...createCategoryDto, userId });
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() request) {
    const userId = request.user.userId;
    return await this.categoryService.findAll(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':categoryId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string, @Request() request) {
    const userId = request.user.userId;
    return await this.categoryService.findOne(categoryId, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':categoryId')
  async update(@Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string,
    @Request() request,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    console.log("work")

    const userId = request.user.userId;
    return await this.categoryService.update(categoryId, updateCategoryDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string, @Request() request): Promise<void> {
    const userId = request.user.userId;
    await this.categoryService.remove(categoryId, userId);
  }
}

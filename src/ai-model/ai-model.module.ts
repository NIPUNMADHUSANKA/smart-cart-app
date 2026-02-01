import { Module } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { AiModelController } from './ai-model.controller';
import { DatabaseService } from 'src/database/database.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [AiModelController],
  providers: [AiModelService, DatabaseService, CategoryService],
})
export class AiModelModule {}

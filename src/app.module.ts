import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [DatabaseModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}

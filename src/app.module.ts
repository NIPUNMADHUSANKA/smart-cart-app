import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { ShoppingItemModule } from './shopping-item/shopping-item.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, CategoryModule, ShoppingItemModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}

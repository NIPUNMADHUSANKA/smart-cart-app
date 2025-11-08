import { Module } from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { ShoppingItemController } from './shopping-item.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ShoppingItemController],
  providers: [ShoppingItemService],
  imports: [DatabaseModule],
})
export class ShoppingItemModule {}

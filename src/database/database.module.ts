import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
    provider: [DatabaseService]
    export: [DatabaseService]
}

import 'dotenv/config';
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    const datasourceUrl = process.env.DATABASE_URL;
    if (!datasourceUrl) {
      throw new HttpException(
        'Missing DATABASE_URL for PrismaClient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const pool = new Pool({ connectionString: datasourceUrl });
    super({ adapter: new PrismaPg(pool) });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      throw new HttpException(
        'Database connection failed',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }


  }
}

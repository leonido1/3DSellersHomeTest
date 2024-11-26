import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // Establish database connection when the module is initialized
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect from the database when the module is destroyed
  }
}

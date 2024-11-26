// src/wix/wix.module.ts
import { Module } from '@nestjs/common';
import { WixService } from './wix.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../env',
    }),
  ],
  providers: [WixService],
  exports: [WixService],
})
export class WixModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { WixModule } from './wix/wix.module';

@Module({
  imports: [ProductsModule, WixModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

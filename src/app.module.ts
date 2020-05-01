import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListingsModule } from './listings/listings.module';
import { ProductService } from './product/product.service';
@Module({
  imports: [ListingsModule],
  controllers: [AppController],
  providers: [AppService, ProductService],
})
export class AppModule { }

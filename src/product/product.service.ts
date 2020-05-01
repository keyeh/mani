import { Injectable } from '@nestjs/common';
import Product from '../product/product.model';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductService {
  public static async getOrCreate(name: string, retailPrice: string) {
    const existingProduct = await Product.findByName(name);
    if (existingProduct) {
      return plainToClass(Product, existingProduct);
    } else {
      return await Product.create(name, retailPrice);
    }
  }
}

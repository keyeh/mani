import Product from '../product/product.model';

export interface LineItem {
  product: Product;
  quantity: number;
}

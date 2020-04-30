import * as firebase from 'firebase';
import { classToPlain, plainToClass } from 'class-transformer';

export default class Product {
  public research = 'wowowo';
  public researchDate;

  constructor(
    public id: string,
    public name: string,
    public retailPrice: string,
  ) {}

  public static async getOrCreate(name: string, retailPrice: string) {
    const existingProduct: any = await new Promise(resolve =>
      firebase
        .database()
        .ref('products')
        .orderByChild('name')
        .equalTo(name)
        .once('value', snapshot => {
          const val = snapshot.val();
          if (val) {
            resolve(val[Object.keys(val)[0]]);
          }
          resolve(null);
        }),
    );
    if (existingProduct) {
      console.log('Product -> getOrCreate -> existingProduct', existingProduct);
      return plainToClass(Product, existingProduct);
    } else {
      const products = firebase.database().ref('products');
      const key = products.push().key;
      const newProduct = new Product(key, name, retailPrice);
      products.update({ [key]: newProduct });
      return newProduct;
    }
  }
}

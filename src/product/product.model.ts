import * as firebase from 'firebase';

export default class Product {
  public research = 'wowowo';
  public researchDate;

  constructor(
    public id: string,
    public name: string,
    public retailPrice: string,
  ) {}

  public static async findByName(name): Promise<{}> {
    return new Promise(resolve =>
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
  }

  public static async create(
    name: string,
    retailPrice: string,
  ): Promise<Product> {
    const products = firebase.database().ref('products');
    const key = products.push().key;
    const newProduct = new Product(key, name, retailPrice);
    return await new Promise(resolve =>
      products.update({ [key]: newProduct }).then(() => resolve(newProduct)),
    );
  }
}

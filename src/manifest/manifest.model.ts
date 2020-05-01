import * as cheerio from 'cheerio';
import { Tabletojson } from 'tabletojson';
import { LineItem } from './manifest.interface';
import { ProductService } from '../product/product.service';
import * as firebase from 'firebase';

export default class Manifest {
  lineItems: LineItem[] = [];
  totalRetailPrice;

  static async create(id, htmlData: string) {
    const manifest = new Manifest();
    await manifest.parse(htmlData);
    firebase
      .database()
      .ref(`manifests/${id}`)
      .set(manifest);
    return manifest;
  }

  public async parse(htmlData) {
    const $ = cheerio.load(htmlData);
    const table = cheerio.html($('table table'));
    const converted = Tabletojson.convert(table, {
      useFirstRowForHeadings: true,
    })[0];

    const totals = converted.pop();
    this.totalRetailPrice = totals['Total Retail Price'];

    const items: LineItem[] = await Promise.all(
      converted.slice(1).map(this.createLineItem),
    );
    // Consolidate same rows into quantity
    for (const lineItem of items) {
      const lastSavedItem = this.lineItems[this.lineItems.length - 1];
      if (lastSavedItem?.product.name === lineItem.product.name) {
        lastSavedItem.quantity++;
      } else {
        this.lineItems.push(lineItem);
      }
    }
  }

  private async createLineItem(obj): Promise<LineItem> {
    const product = await ProductService.getOrCreate(
      obj['Product'],
      obj['Retail Price'].replace('$', ''),
    );

    return {
      product,
      quantity: parseInt(obj.Quantity),
    };
  }
}

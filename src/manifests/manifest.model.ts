import * as cheerio from 'cheerio';
import { Tabletojson } from 'tabletojson';

export class Manifest {
  items = [];
  totals;

  constructor(rawData: string) {
    this.parse(rawData);
  }

  public parse(rawData) {
    const $ = cheerio.load(rawData);
    const table = cheerio.html($('table table'));
    const converted = Tabletojson.convert(table, {
      useFirstRowForHeadings: true,
    })[0];

    this.totals = converted.pop();
    const stuff = converted.slice(1).map(this.parseItem);
    // Consolidate same rows into quantity
    for (const item of stuff) {
      const lastSavedItem = this.items[this.items.length - 1];
      if (lastSavedItem?.name === item.name) {
        lastSavedItem.quantity++;
      } else {
        this.items.push(item);
      }
    }
  }

  private parseItem(item) {
    return {
      name: item.Product,
      retailPrice: item['Retail Price'].replace('$', ''),
      // totalRetailPrice: item['Total Retail Price'].replace('$', ''),
      quantity: parseInt(item.Quantity),
    };
  }
}

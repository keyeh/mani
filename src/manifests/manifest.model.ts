import * as cheerio from 'cheerio';
import { Tabletojson } from 'tabletojson';

export class Manifest {
  items;
  totals;

  constructor(rawData: string) {
    this.parse(rawData);
  }

  public parse(rawData) {
    const $ = cheerio.load(rawData);
    const table = cheerio.html($('table table'));
    // console.log(table);
    const converted = Tabletojson.convert(table, {
      useFirstRowForHeadings: true,
    })[0];

    this.totals = converted.pop();
    this.items = converted.slice(1).map(this.parseItem);
  }

  private parseItem(item) {
    return {
      name: item.Product,
      retailPrice: item['Retail Price'].replace('$', ''),
      totalRetailPrice: item['Total Retail Price'].replace('$', ''),
      quantity: parseInt(item.Quantity),
    };
  }
}

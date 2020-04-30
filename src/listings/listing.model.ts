import Manifest from 'src/manifests/manifest.model';
import axios from 'axios';
import * as firebase from 'firebase';
import * as cheerio from 'cheerio';

export class Listing {
  public lineItems;
  constructor(public id: string, public url: string) {}

  public async scrape() {
    console.log(this.url);
    const res = await axios.get(this.url);
    let data = res.data;
    // Find manifest link on page
    const manifestUrl = cheerio
      .load(data)('a.view_manifest')
      .attr('href');
    if (manifestUrl) {
      const res = await axios.get(manifestUrl);
      data = res.data;
    }
    // Create/parse manifest
    const manifest = await Manifest.create(data);

    this.lineItems = manifest.lineItems;

    firebase
      .database()
      .ref(`listings/${this.id}/lineItems`)
      .set(this.lineItems);
  }
}

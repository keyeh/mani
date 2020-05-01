import Manifest from 'src/manifest/manifest.model';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as firebase from 'firebase';
import { classToPlain, plainToClass } from 'class-transformer';

export class Listing {
  // public lineItems;
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
    await Manifest.create(this.id, data);

    // this.lineItems = manifest.lineItems;
  }

  public async getManifest(): Promise<Manifest> {
    const json = await new Promise(resolve =>
      firebase
        .database()
        .ref('manifests/' + this.id)
        .once('value', snapshot => resolve(snapshot.val())),
    );
    if (json) {
      return plainToClass(Manifest, json);
    }
  }
}

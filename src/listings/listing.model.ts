import { Manifest } from 'src/manifests/manifest.model';
import axios from 'axios';
import * as firebase from 'firebase';

export class Listing {
  public items;
  constructor(public id: string, public url: string) {}

  public async scrape() {
    console.log(this.url);
    const res = await axios.get(this.url);
    const data = res.data;

    const manifest = new Manifest(data);
    this.items = manifest.items;

    firebase
      .database()
      .ref(`listings/${this.id}/items`)
      .set(this.items);
  }
}

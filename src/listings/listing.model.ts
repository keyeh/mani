import { Manifest } from 'src/manifests/manifest.model';
import axios from 'axios';

export class Listing {
  private manifest;

  constructor(public id: string, public url: string) {
    this.scrape();
  }

  async scrape() {
    console.log(this.url);
    const res = await axios.get(this.url);
    const data = res.data;
    this.manifest = new Manifest(data.toString());
  }
}

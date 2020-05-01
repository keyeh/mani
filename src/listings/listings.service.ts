import { Injectable, NotFoundException } from '@nestjs/common';
import { Listing } from './listing.model';
import * as firebase from 'firebase';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class ListingsService {
  addListing(url: string): string {
    const listings = firebase.database().ref('listings');
    const key = listings.push().key;

    const listing = new Listing(key, url);
    // Create/parse manifest async
    listing.scrape();

    listings.update({ [key]: classToPlain(listing) });
    return key;
  }

  // Todo
  async getAllListings(): Promise<any> {
    const json = await new Promise(resolve =>
      firebase
        .database()
        .ref('listings')
        .once('value', snapshot => resolve(snapshot.val())),
    );
    return Object.values(json);
  }

  async getListing(id: string): Promise<Listing> {
    const json = await new Promise(resolve =>
      firebase
        .database()
        .ref('listings/' + id)
        .once('value', snapshot => resolve(snapshot.val())),
    );
    if (json) {
      return plainToClass(Listing, json);
    }
    throw new NotFoundException();
  }

  async getHistogram(id: string) {
    const listing = await this.getListing(id);
    const manifest = await listing.getManifest();
    const csv = manifest.lineItems.reduce(
      (acc, line) => {
        const filledArray = new Array(line.quantity).fill(
          line.product.retailPrice,
        );
        return [...acc, ...filledArray];
      },
      ['price'],
    );
    return csv.join('\n');
  }
}

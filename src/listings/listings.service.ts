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
    listing.scrape();
    listings.update({ [key]: classToPlain(listing) });
    return key;
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
    const csv = listing.items.reduce(
      (acc, item) => {
        const filledArray = new Array(item.quantity).fill(item.retailPrice);
        return [...acc, ...filledArray];
      },
      ['price'],
    );
    return csv.join('\n');
  }
}

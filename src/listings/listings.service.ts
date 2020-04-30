import { Injectable, NotFoundException } from '@nestjs/common';
import { Listing } from './listing.model';

@Injectable()
export class ListingsService {
  private listings: Listing[] = [];

  private getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  addListing(title: string) {
    const id = '1';
    const listing = new Listing(id, title);
    this.listings.push(listing);
    return id;
  }

  getListing(id?: string) {
    if (id) {
      const listing = this.listings.find(l => l.id === id);
      if (listing) {
        return listing;
      }
      throw new NotFoundException(`Could not find listing ${id}`);
    }
    return this.listings;
  }

  getHistogram(id: string) {
    const listing: any = this.getListing(id);
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

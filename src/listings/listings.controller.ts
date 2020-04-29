import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Post()
  addListing(@Body('url') listingUrl: string): any {
    const addedId = this.listingsService.addListing(listingUrl);
    return { id: addedId };
  }

  @Get()
  getAllListings() {
    return this.listingsService.getListing();
  }

  @Get(':id')
  getListing(@Param('id') id: string) {
    return this.listingsService.getListing(id);
  }
}

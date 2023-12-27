import { Component, OnInit } from '@angular/core';
import { TourBundle } from '../model/tour-bundle.model';
import { MarketplaceService } from '../marketplace.service';
import { PageEvent } from '@angular/material/paginator';
import { ItemType, OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PurchasedTourPreview } from '../../tour-execution/model/purchased_tour_preview.model';

@Component({
  selector: 'xp-tour-bundle-table',
  templateUrl: './tour-bundle-table.component.html',
  styleUrls: ['./tour-bundle-table.component.css']
})
export class TourBundleTableComponent implements OnInit {

  tourBundles: TourBundle[] = [];
  pageSize = 5;
  pageIndex = 1;
  totalTourBundles = 0;
  userCart: ShoppingCart;
  cartItemCount: number;
  tourBundle: TourBundle;
  tourBundleId: number | undefined = undefined;
  user: User;
  purchasedTours: PurchasedTourPreview[] = [];

  constructor(private service: MarketplaceService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadTourBundles();
    this.service.cartItemCount$.subscribe(count => this.cartItemCount = count);
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.findShoppingCart();
    });
  }

  loadTourBundles(): void {
    this.service.getTourBundles(this.pageIndex, this.pageSize).subscribe((result) => {
      this.handleTourBundleLoad(result);
      this.loadPurchasedTours();
    });
  }

  priceSum(tourBundle: TourBundle){
    var sum = 0;
    if(!tourBundle.tours){
      return sum;
    }
    for(let tour of tourBundle.tours){
      sum += tour.price;
    }
    return sum;
  }
  averageGrade(tour: Tour){
    var sum = 0;
    var count = 0;
    for(let g of tour.tourRatings){
      sum += g.rating;
      count ++;
    }
    return parseFloat((sum/count).toFixed(1)).toFixed(1);
  }
  private handleTourBundleLoad(result: any): void {
    this.tourBundles = result.results;
    this.totalTourBundles = result.totalCount;
  }

  loadPurchasedTours(): void {
    if (this.user) {
      this.service.getTouristsPurchasedTours(this.user.id).subscribe((purchasedTours) => {
        this.purchasedTours = purchasedTours;
      });
    }
  }

  isTourInBundlePurchased(tourBundle: TourBundle): boolean {
    return tourBundle.tours?.some(tour => this.purchasedTours.some(purchasedTour => purchasedTour.id === tour.id)) || false;
  }

  areAllToursInBundlePurchased(tourBundle: TourBundle): boolean {
    return tourBundle.tours?.every(tour => this.purchasedTours.some(purchasedTour => purchasedTour.id === tour.id)) || false;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex + 1;
    this.loadTourBundles();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.value;
    this.pageIndex = 1;
    this.loadTourBundles();
  }

  onAddToCart(tourBundle: TourBundle): void {
    if (!window.confirm('Are you sure you want to add this item to the cart?')) {
      return;
    }
  
    if (this.isTourInBundlePurchased(tourBundle) && !window.confirm('Some tours within the bundle have already been purchased. Would you like to purchase the bundle excluding those tours?')) {
      return;
    } 
      
    this.tourBundleId = tourBundle.id;
    const orderItem: OrderItem = {
      itemId: tourBundle.id || 0,
      name: tourBundle.name,
      price: tourBundle.price,
      type: ItemType.Bundle
    };
    this.addItemToCart(orderItem);
  }

  addItemToCart(orderItem: OrderItem): void {
    console.log('brt jel se ovo pozove');
    this.service.addItemToShoppingCart(orderItem).subscribe((cart) => {
      this.cartItemCount = cart.items.length;
      this.service.updateCartItemCount(cart.items.length);
      this.userCart = cart;
    });
  }

  findShoppingCart(): void {
    this.service.getShoppingCart(this.user.id).subscribe((result) => {
      this.userCart = result;
      this.service.startShoppingSession(this.user.id).subscribe(_ => {
        console.log('Shopping session started!')
      });
    });
  }

  isBundleInCart(tourBundleId: number): boolean {
    if (this.userCart.items.length > 0) {
      return this.userCart.items.some(item => item.itemId === tourBundleId);
    }
    return false;
  }
  selectTour(tour:Tour){
    if(tour.id){
      this.router.navigate(['/tour-overview-details', tour.id]);
    }
  }
}
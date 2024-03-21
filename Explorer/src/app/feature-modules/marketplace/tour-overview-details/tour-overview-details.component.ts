import { Component, OnInit, ViewChild } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Router } from '@angular/router';
import { CheckpointPreview } from '../model/checkpoint-preview';
import { ItemType, OrderItem } from '../model/order-item.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourRating } from '../model/tour-rating.model';
import { PurchasedTourPreview } from '../../tour-execution/model/purchased_tour_preview.model';
import { ImageService } from 'src/app/shared/image/image.service';
import { PublishedTour } from '../model/published-tour.model';

@Component({
  selector: 'xp-tour-overview-details',
  templateUrl: './tour-overview-details.component.html',
  styleUrls: ['./tour-overview-details.component.css']
})
export class TourOverviewDetailsComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent: MapComponent;

  tour: PublishedTour;
  tourID: number;
  checkpoints: CheckpointPreview;
  profiles: string[] = ['walking', 'cycling', 'driving'];
  profile: string = this.profiles[0];
  user: User;
  tourAvarageRating: number = 0;
  shouldEdit: boolean = false;
  selectedRating: TourRating;
  userCart: ShoppingCart;
  isTourInCart: boolean = false;
  buttonColor: string = 'orange';
  cartItemCount: number;
  location: string;
  tours: PublishedTour[] = [];
  isTourOnSale: boolean = false;
  purchasedTours: PurchasedTourPreview[] = [];

  constructor(private service: MarketplaceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private imageService: ImageService) { }

  ngOnInit(): void {
    this.service.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });

    this.authService.user$.subscribe(user => {
      this.user = user;

      this.activatedRoute.params.subscribe(params => {
        this.tourID = params['id'];
        this.getPublishedTour(this.tourID);
        this.findShoppingCart();
        this.getTourDetails();
      });

      this.service.getTouristsPurchasedTours(this.user.id).subscribe((purchasedTours) => {
        this.isTourInCart = this.isTourPurchased(purchasedTours);
        this.buttonColor = this.isTourInCart ? 'gray' : 'orange';
      });
    });
  }

  route(): void {
    let coords: [{ lat: number, lon: number }] = [{ lat: this.checkpoints.latitude, lon: this.checkpoints.longitude }];
    coords.push({ lat: this.checkpoints.latitude, lon: this.checkpoints.longitude });
    this.mapComponent.setRoute(coords, this.profile);
  }

  ngAfterViewInit(): void {
    if (this.checkpoints != null) {
      let coords: [{ lat: number, lon: number }] = [{ lat: this.checkpoints.latitude, lon: this.checkpoints.longitude }];
      coords.push({ lat: this.checkpoints.latitude, lon: this.checkpoints.longitude });
      this.mapComponent.setRoute(coords, 'walking');
      this.searchByCoord(this.checkpoints.latitude, this.checkpoints.longitude);
    }

    this.tours[0] = this.tour;
  }

  searchByCoord(lat: number, lon: number) {
    this.mapComponent.reverseSearch(lat, lon).subscribe({
      next: (location) => {
        const foundLocation = location;
        console.log('Found Location Name:', foundLocation.display_name);
        this.location = foundLocation.address.city + ", " + foundLocation.address.country;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  isTourPurchased(purchasedTours: PurchasedTourPreview[]): boolean {
    return purchasedTours.some(tour => tour.id.toString() === this.tourID.toString());
  }

  getPublishedTour(id: number): void {
    this.service.getPublishedTour(id).subscribe((result: PublishedTour) => {
      this.tour = result;
      console.log(this.tour);
      this.checkpoints = this.tour.checkpoints[0];
      if (this.checkpoints != null) {
        this.route();
      }
    });
  }

  getTourDetails(): void {
    this.service.getAverageRating(this.tourID).subscribe(
      (average: number) => {
        this.tour.avgRating = average;
        this.service.getTourReviews(this.tourID, "tour").subscribe(
          (reviews) => {
            this.tour.tourRating = reviews.results;
          },
          (error) => {
            console.error('Error fetching reviews for tour', this.tourID, ':', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching average rating for tour', this.tourID, ':', error);
        this.tour.avgRating = 0;
      }
    );
  }


  onBack(): void {
    this.router.navigate([`tour-overview`]);
  }

  onAddToCart(t: PublishedTour): void {
    const isConfirmed = window.confirm('Are you sure you want to add this item to the cart?');
    if (isConfirmed) {
      const orderItem: OrderItem = {
        itemId: t.id || 0,
        name: t.name,
        price: t.price,
        type: ItemType.Tour
      };
      this.addItemToCart(orderItem);
    }
  }

  addItemToCart(orderItem: OrderItem): void {
    this.service.addItemToShoppingCart(orderItem).subscribe((cart) => {
      this.cartItemCount = cart.items.length;
      this.service.updateCartItemCount(cart.items.length);
      this.userCart = cart;
      this.isTourInCart = this.checkIsTourInCart();
      if (this.isTourInCart == true) {
        this.buttonColor = 'gray';
      }
    });
  }

  rateTour(tour: PublishedTour): void {
    this.router.navigate(['/tour-rating-form', tour.id]);
  }

  checkIsTourInCart(): boolean {
    if (this.userCart.items.length > 0) {
      return this.userCart.items.some(item => item.itemId == this.tourID);
    }
    return false;
  }

  getFormattedTransportation(transportation: string): string {
    switch (transportation.toLowerCase()) {
      case 'cycling':
        return 'Cycling';
      case 'walking':
        return 'Walking';
      case 'driving':
        return 'Driving';
      default:
        return transportation;
    }
  }

  findShoppingCart(): void {
    this.service.getShoppingCart(this.user.id).subscribe((result) => {
      if (!result) {
        this.isTourInCart = false;
        this.buttonColor = 'orange';
      } else {
        this.userCart = result;
        this.isTourInCart = this.checkIsTourInCart();
        if (this.isTourInCart == true) {
          this.buttonColor = 'gray';
        }
      }
    });
  }
  
  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}
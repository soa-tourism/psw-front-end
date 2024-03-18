import { Component, OnInit, ViewChild } from '@angular/core'; //dodala ViewChild
import { Tour } from '../../tour-authoring/model/tour.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { LayoutService } from '../layout.service';
import { TourPreview } from '../../marketplace/model/tour-preview';
import { MapComponent } from 'src/app/shared/map/map.component'; //dodala
import { TourLocation } from '../../marketplace/model/tour-location.model';
import { MapService } from 'src/app/shared/map/map.service';
import { Router } from '@angular/router';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { Sale } from '../../marketplace/model/sale.model';
import { ImageService } from 'src/app/shared/image/image.service';

@Component({
  selector: 'xp-travelers-choice',
  templateUrl: './travelers-choice.component.html',
  styleUrls: ['./travelers-choice.component.css']
})
export class TravelersChoiceComponent implements OnInit{
  
  @ViewChild(MapComponent) mapComponent: MapComponent; //potrebna metoda iz mape
  constructor(private service: LayoutService, private mapService: MapService, private router: Router, private marketService: MarketplaceService, private imageService: ImageService) { 
    
  }

  ngOnInit(): void {
    this.service.getTopRatedTours(5).subscribe({

      next: (result: TourPreview[]) => {
        this.tours = result;
        this.marketService.getActiveSales().subscribe((activeSales: Sale[]) => {
          this.tours = this.mapDiscountedPricesToTours(this.tours, activeSales);
          this.findToursLocation();
        });
      },
      error: () => {
          console.log('Nesupesno dobavljanje tura');
      }
    });
  }
  i:number=0;
  tours: TourPreview[] = [];
  toursLocation: TourLocation[] = [];

  findToursLocation(): void {
    this.tours.forEach(tour => {
      this.mapService.reverseSearch(tour.checkpoint.latitude, tour.checkpoint.longitude).subscribe({
        next: (location) => {
          let tourLocation: TourLocation = {
            tourid: 0,
            adress: ''
          };
  
          if (location.address.city === undefined) {
            tourLocation = {
              tourid: tour.id || 0,
              adress: location.address.city_district + ' , ' + location.address.country 
            };
          }
          else {
            tourLocation = {
              tourid: tour.id || 0,
              adress: location.address.city + ' , ' + location.address.country 
            };
          }
  
          console.log(location);
          this.toursLocation.push(tourLocation);
        },
        error: (error) => {
          console.error('Error in finding location for lon and lat:', error);
        }
      });
    });
  }

  mapDiscountedPricesToTours(tours: TourPreview[], activeSales: Sale[]): TourPreview[] {
    return tours.map(tour => {
      const matchingSale = activeSales.find(sale => sale.toursIds.includes(tour.id!));
      const discountedPrice = this.calculateDiscountedPrice(tour, activeSales);
      const isOnSale = this.isOnSale(tour.id!, activeSales);
      const saleExpiration = matchingSale?.end;

      return { 
        ...tour,
        discount: matchingSale ? matchingSale.discount : 0,
        salePrice: discountedPrice,
        isOnSale: isOnSale,
        saleExpiration: saleExpiration,
        isLastMinute: this.isLastMinute(saleExpiration)
      };
    });
  }

  isLastMinute(saleExpiration?: Date) {
    var today = new Date();
    var futureDate = new Date(today.setDate(today.getDate() + 4));
    today = new Date()
      if (saleExpiration) {
        var saleExpirationDate = new Date(saleExpiration);
          if (saleExpirationDate < futureDate && saleExpirationDate > today) {
              return true;
          } else {
              return false;
          }
      } else {
          return false;
      }
  }

  calculateDiscountedPrice(tour: TourPreview, activeSales: Sale[]): number {
    const activeSale = activeSales.find(sale => sale.toursIds.includes(tour.id!));
    if (activeSale) {
      const discountPercentage = activeSale.discount;
      const discountedPrice = tour.price * (1 - discountPercentage / 100);
      return discountedPrice;
    } else {
      return tour.price;
    }
  }
  isOnSale(tourId: number, activeSales: Sale[]): boolean {
    return activeSales.some(sale => sale.toursIds.includes(tourId));
  }

  getTourLocation(tourid: number): string{
    const tourLocation = this.toursLocation.find(location => location.tourid === tourid);
    return tourLocation?.adress || "";
  }

  selectTour(tour:TourPreview){
    if(tour.id){
      this.router.navigate(['/tour-overview-details', tour.id]);
    }
  }
  
  averageGrade(tour: TourPreview){
    var sum = 0;
    var count = 0;
    for(let g of tour.tourRating){
      sum += g.rating;
      count ++;
    }
    return parseFloat((sum/count).toFixed(1)).toFixed(1);
  }
  swipeRight() {
    const cardWidth = document.querySelector('.tour-card')?.clientWidth || 0;
    const container = document.querySelector('.tour-cards-container');
  
    if (container && this.i + 3 < this.tours.length) {
      this.i++;
      // Use scrollTo for smooth scrolling
      container.scrollTo({
        left: container.scrollLeft + cardWidth,
        behavior: 'smooth',
      });
    }
  }
  
  swipeLeft() {
    const cardWidth = document.querySelector('.tour-card')?.clientWidth || 0;
    const container = document.querySelector('.tour-cards-container');
  
    if (container && this.i > 0) {
      this.i--;
      // Use scrollTo for smooth scrolling
      container.scrollTo({
        left: container.scrollLeft - cardWidth,
        behavior: 'smooth',
      });
    }
  }

  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}

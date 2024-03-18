import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/shared/image/image.service';
import { TourLocation } from '../../marketplace/model/tour-location.model';
import { MapService } from 'src/app/shared/map/map.service';
import { Sale } from '../../marketplace/model/sale.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit{
  tours: Tour[] = [];
  selectedTour: Tour;
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;
  user: User;
  id:number;
  activeSales: Sale[] = [];
  toursLocation: TourLocation[] = [];
  
  picture:string="https://conversionfanatics.com/wp-content/themes/seolounge/images/no-image/No-Image-Found-400x264.png";

  
  constructor(private service: TourAuthoringService, private marketPlaceService: MarketplaceService, private mapService: MapService, private authService: AuthService, private router: Router, private imageService: ImageService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.marketPlaceService.getAuthorsActiveSales().subscribe((result: Sale[]) => {
      this.activeSales = result;
      this.getTour();
    });
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

  deleteTour(id: number): void {
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.getTour();
      },
    })
  }

  findToursLocation(): void {
    this.tours.forEach(tour => {
      if(!tour.checkpoints[0]) return
      this.mapService.reverseSearch(tour.checkpoints[0].latitude, tour.checkpoints[0].longitude).subscribe({
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
          //alert('Error in finding location for lon and lat:');
        }
      });
    });
  }

  getTourLocation(tourid: number): string{
    const tourLocation = this.toursLocation.find(location => location.tourid === tourid);
    return tourLocation?.adress || "";
  }

  getTour(): void {
    this.service.getToursByAuthor(this.user.id).subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        console.log('Ture: ');
        console.log(this.tours);
        this.tours.forEach(element => {
          element.checkpoints = element.checkpoints || [];
        });
        console.log(this.tours);
        this.findToursLocation();
      },
      error: () => {
      }
    })
  }

  onEditClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldRenderTourForm = true;
    this.shouldEdit = true;
    this.router.navigate([`tour-form/${tour.id}`]);

  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourForm = true;
    this.router.navigate([`tour-form/0`]);

  }
  openDetails(t:Tour): void {
    this.router.navigate([`tour-details/${t.id}`]);
  }

  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }

  isLastMinute(tourId: number) {
    const matchingSale = this.activeSales.find(sale => sale.toursIds.includes(tourId!));
    var saleExpiration = matchingSale?.end;
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

  DiscountedPrice(tourid: number, tourPrice: number): number {
    const activeSale = this.activeSales.find(sale => sale.toursIds.includes(tourid!));
    if (activeSale) {
      const discountPercentage = activeSale.discount;
      const discountedPrice = tourPrice * (1 - discountPercentage / 100);
      return discountedPrice;
    } else {
      return tourPrice;
    }
  }

  Discount(tourid: number): number {
    const activeSale = this.activeSales.find(sale => sale.toursIds.includes(tourid!));
    if (activeSale) {
      return activeSale.discount;
    } else {
      return 0;
    }
  }

  isOnSale(tourId: number): boolean {
    return this.activeSales.some(sale => sale.toursIds.includes(tourId));
  }
}

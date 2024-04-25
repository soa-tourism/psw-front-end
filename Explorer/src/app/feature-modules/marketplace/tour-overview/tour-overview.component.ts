import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs'; 
import { MarketplaceService } from '../marketplace.service';
import { Router } from '@angular/router';
import { MapComponent } from 'src/app/shared/map/map.component';
import { PublishedTour } from '../model/published-tour.model';
import { MapObject } from '../../tour-authoring/model/map-object.model';
import { PublicCheckpoint } from '../../tour-execution/model/public_checkpoint.model';
import { AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourLocation } from '../model/tour-location.model';
import { MapService } from 'src/app/shared/map/map.service';
import { ImageService } from 'src/app/shared/image/image.service';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css'], 
})
export class TourOverviewComponent implements OnInit, AfterViewInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;
  constructor(private service: MarketplaceService, private router: Router, private authService: AuthService, private mapService: MapService, private imageService: ImageService) { }

  ngAfterViewInit(): void {
    if(this.mapObjects.length > 0)
    this.addMapObjectsOnMap();
    if(this.publicCheckpoints.length > 0)
    this.addPublicCheckpoinsOnMap();
  }
  publishedTours:PublishedTour[]=[];
   //search:
  publicTours: PublishedTour[] = [];
  foundTours: PublishedTour[] = [];
  searchTours: PublishedTour[] = [];
  backupSearchTours: PublishedTour[] = []; /////////////////
  selectedLongitude: number;
  selectedLatitude: number;
  radius: number = 500; // Inicijalna vrednost precnika (scroller)
  picture:string="https://conversionfanatics.com/wp-content/themes/seolounge/images/no-image/No-Image-Found-400x264.png";
  mapObjects: MapObject[] = [];
  publicCheckpoints: PublicCheckpoint[] = [];
  user: User;
  showOnlyOnSale: boolean = false;
  sortOrder: 'asc' | 'desc' = 'asc';
  toursLocation: TourLocation[] = [];
  visibleFilters: boolean = false;

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.service.startShoppingSession(this.user.id).subscribe(_ => {
      console.log('Shopping session started!')
    }); /////////////////
  
    this.service.getMapObjects().subscribe( result => {
      this.mapObjects = result.results;
      this.addMapObjectsOnMap();
    });

    this.service.getPublicCheckpoints().subscribe( result => {
      this.publicCheckpoints = result.results;
      this.addPublicCheckpoinsOnMap();
    });

    this.service.getPublishedTours().subscribe((tours: PublishedTour[]) => {
      this.publishedTours = tours;
      this.publishedTours.forEach(tour => {
        this.service.getAverageRating(tour.id!).subscribe(
          (average: number) => {
            tour.avgRating = average;
          },
          (error) => {
            console.error('Error fetching average rating for tour', tour.id, ':', error);
            tour.avgRating = 0; 
          }
        );
      });

      this.searchTours = this.publishedTours;
      this.findToursLocation();
    });
  }



  getTourLocation(tourid: string): string{
    const tourLocation = this.toursLocation.find(location => location.tourid === tourid);
    return tourLocation?.adress || "";
  }

  scrollToFilters(){
    this.searchTours = this.backupSearchTours;/////////////
    this.visibleFilters = true;
    setTimeout(() => {
      const filtersElement = document.getElementById('filters');
  
      if (filtersElement) {
        filtersElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  }

  openDetails(tour: PublishedTour):void{
    this.router.navigate([`tour-overview-details/${tour.id}`]);
  }

  onMapClick(event: { lat: number; lon: number }) {
    this.selectedLatitude = event.lat;
    this.selectedLongitude = event.lon;
    this.updateRadius();
  }

  addMapObjectsOnMap(): void{
    if(this.mapObjects)
    {
      let coords: [{lat: number, lon: number, category: string, name: string, desc: string, picture: string}] = [{lat: this.mapObjects[0].latitude, lon: this.mapObjects[0].longitude, category: this.mapObjects[0].category, name: this.mapObjects[0].name, desc: this.mapObjects[0].description, picture: this.mapObjects[0].pictureURL}];
      this.mapObjects.forEach(e => {
          coords.push({lat:e.latitude, lon:e.longitude, category: e.category, name: e.name, desc: e.description, picture:e.pictureURL});
      });
      this.mapComponent.addMapObjects(coords);
    }
  }

  addPublicCheckpoinsOnMap(): void{
    if(this.publicCheckpoints)
    {
      let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: this.publicCheckpoints[0].latitude, lon: this.publicCheckpoints[0].longitude, picture: this.publicCheckpoints[0].pictures[0], name: this.publicCheckpoints[0].name, desc: this.publicCheckpoints[0].description}];
      this.publicCheckpoints.forEach(e => {
          if(e != this.publicCheckpoints[0])
            if((e.latitude > (this.publicCheckpoints[0].latitude - 2) && (e.latitude < this.publicCheckpoints[0].latitude + 2))
            && ((e.longitude > this.publicCheckpoints[0].longitude - 2) && (e.longitude < this.publicCheckpoints[0].longitude + 2)))
            coords.push({lat:e.latitude, lon:e.longitude, picture: e.pictures[0], name: e.name, desc: e.description});
      });
      this.mapComponent.addPublicCheckpoints(coords);
    }
  }
  updateRadius() {
    this.drawCircle();
  }

  ////////////
  findNearTours(): void{
    const promises = this.publicTours.map(tour => {
      if(tour)
        return this.checkDistance(tour);
      else
        return 0;
    });

    setTimeout(() => {
      this.searchTours = [];
      this.searchTours = this.foundTours;
      this.foundTours = [];
    }, 2000);

    Promise.all(promises).then(() => {
      if (this.foundTours.length >= 0) {
        // this.searchTours = [];
        // this.searchTours = this.foundTours;
        // this.foundTours = [];
      }
    })
    .catch(error => {
      console.error("greskaaaa    " + error); // Handle any errors that occurred during promise resolution
    });
      
  }

  checkDistance(tour: PublishedTour): Promise<void> {
    console.log(tour);
    const originCoords: { lat: number; lon: number } = {
      lat: this.selectedLatitude,
      lon: this.selectedLongitude
    };
  
    let found = false;
  
    const promises = tour.checkpoints.map(checkpoint => {
      const destinationCoords: { lat: number; lon: number } = {
        lat: checkpoint.latitude,
        lon: checkpoint.longitude
      };
  
      return this.mapComponent.calculateDistance([originCoords, destinationCoords], 'walking')
        .then(distanceBetween => {
          console.log(distanceBetween);
          if (distanceBetween <= this.radius && !found) {
            const existingTour = this.findTourById(tour.id || '');
  
            if (existingTour && !this.foundTours.some(t => t.id === existingTour.id)) {
              this.foundTours.push(existingTour);
            }
            this.drowTour(tour);
            found = true;
          }
        })
        .catch(error => {
          console.error('Greška pri izračunavanju rute:', error);
          throw error;
        });
    });
  
    return Promise.all(promises)
      .then(() => {
      })
      .catch(error => {
        console.error('Error in Promise.all:', error);
      });
  }
  


  findTourById(id: string): PublishedTour | undefined{
    return this.publishedTours.find(t => t.id === id);
  }
  applyFilters(){
    if(this.selectedLatitude && this.selectedLongitude)
      this.findNearTours();
    setTimeout(() => {
      console.log("test")
      console.log(this.searchTours);
      console.log("test")
      const filtersElement = document.getElementById('title');
      if (filtersElement) {
        filtersElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 1000);
    
  }

  drowTour(tour: PublishedTour): void{
    let coords: [{ lat: number, lon: number }] = [{ lat: tour.checkpoints[0].latitude, lon: tour.checkpoints[0].longitude}];
    tour.checkpoints.forEach(e => {
        if(e != tour.checkpoints[0])
          coords.push({lat:e.latitude, lon:e.longitude});
    });
    this.mapComponent.setRoute(coords, 'walking'); //proveriti za profil, izmena?
  }
  
  drawCircle(): void {
    console.log(this.radius);
    this.mapComponent.setCircle(
      { lat: this.selectedLatitude, lon: this.selectedLongitude },
      this.radius
    );
  }

  cancelSearch():void {
    const filtersElement = document.getElementById('title');
    this.selectedLatitude = 0;
    this.selectedLongitude = 0;
      if (filtersElement) {
        filtersElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      this.searchTours = this.publishedTours;
      this.showOnlyOnSale = false;
      this.radius = 100;
    setTimeout(() => {
      this.visibleFilters = false;
    }, 600);
    this.mapComponent.reloadMap();
  }

  findToursLocation(): void {
    this.searchTours.forEach(tour => {
      this.mapService.reverseSearch(tour.checkpoints[0].latitude, tour.checkpoints[0].longitude).subscribe({
        next: (location) => {
          let tourLocation: TourLocation = {
            tourid: '',
            adress: ''
          };
  
          if (location.address.city === undefined) {
            tourLocation = {
              tourid: tour.id || '',
              adress: location.address.city_district + ' , ' + location.address.country 
            };
          }
          else {
            tourLocation = {
              tourid: tour.id || '',
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

  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}

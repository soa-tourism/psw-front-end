import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { TourPreview } from '../../marketplace/model/tour-preview';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckpointPreview } from '../../marketplace/model/checkpoint-preview';

@Component({
  selector: 'xp-tour-recommendations',
  templateUrl: './tour-recommendations.component.html',
  styleUrls: ['./tour-recommendations.component.css']
})
export class TourRecommendationsComponent implements OnInit{
  recommendedTours: TourPreview[] = [];
  user: User;
  tourId: number;
  poruka: string = '';
  filterRating: number | null = null;

  constructor(private service: TourExecutionService,private authService: AuthService,private router:Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.route.params.subscribe(params => {
        this.tourId = +params['id']; 
        this.getRecommendedTours();
      });
    });
  }

  getRecommendedTours(): void {
    this.service.getRecommendedTours(this.tourId).subscribe({
      next: (result: TourPreview[]) => {
        this.recommendedTours = result;
        console.log('Predložene ture: ');
        console.log(this.recommendedTours);
      },
      error: () => {
        console.log('Greska prilikom preuzimanja predlozenih tura!');
      }
    })
    
  }

  sendToursToMail(): void{
    this.service.sendRecommendedToursToMail(this.tourId).subscribe({
      next: (result: PagedResults<TourPreview>) => {
        console.log('Uspesno poslat mejl!');
        this.poruka = 'Check your e-mail!';
      },
      error: () => {
        console.log('Greska prilikom slanja mejla!');
      }
    });
  }

  filterRecommendedTours() {
    if (this.filterRating !== null) {
      this.recommendedTours = this.recommendedTours.filter(tour => {
        return tour.tourRating.some(r => r.rating >= this.filterRating!);
      });
    }
  }

  showAll() {
    this.getRecommendedTours();
  }

}
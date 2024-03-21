import { Component, OnChanges } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { PublishedTour } from '../model/published-tour.model';


@Component({
  selector: 'xp-reporting-issue',
  templateUrl: './reporting-issue.component.html',
  styleUrls: ['./reporting-issue.component.css']
})
export class ReportingIssueComponent implements OnChanges {
  reportingIssueForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    time: new FormControl(new Date(), [Validators.required]),
    tourId: new FormControl('', [Validators.required]),
    touristId: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
  });
  tours: PublishedTour[] = [];

  constructor(private service: MarketplaceService, private authService: AuthService, private router: Router) {}

  ngOnChanges(): void {
    this.reportingIssueForm.reset();
  }

  ngOnInit(): void {
    this.service.getPublishedTours().subscribe((result) => {
      this.tours = result;
    });
  }

  addReportedIssue(): void {
    let priorityValue = 0;
    if(this.reportingIssueForm.value.priority){
      priorityValue = +this.reportingIssueForm.value.priority;
    }
    let tourIdValue = 0;
    if(this.reportingIssueForm.value.tourId){
      tourIdValue = +this.reportingIssueForm.value.tourId;
    }
    const user = this.authService.user$.getValue();


    if (priorityValue !== null && tourIdValue !== null && user !== null) {
      const message = this.reportingIssueForm.value.category + "/"+ this.reportingIssueForm.value.description+
      "/"+priorityValue+"/"+tourIdValue+"/"+user.id;


      this.service.addReportedIssue(message).subscribe({
        next: () => {
          alert('Problem reported successfully.')
          this.router.navigate([`/home`]);}
      });
    }
  }

  formatDate(date: any): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}



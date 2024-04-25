import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourRatingComponent } from './tour-rating/tour-rating.component';
import { TourRatingFormComponent } from './tour-rating-form/tour-rating-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TourAuthoringModule } from "../tour-authoring/tour-authoring.module";
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PurchasedToursComponent } from './purchased-tours/purchased-tours.component';
import { TourOverviewComponent } from './tour-overview/tour-overview.component';
import { TourOverviewDetailsComponent } from './tour-overview-details/tour-overview-details.component';
import { PurchasedToursDetailsComponent } from './purchased-tours-details/purchased-tours-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ForecastPopupComponent } from './forecast-popup/forecast-popup.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations: [
        TourRatingComponent,
        TourRatingFormComponent,
        ShoppingCartComponent,
        PurchasedToursComponent,
        TourOverviewComponent,
        TourOverviewDetailsComponent,
        PurchasedToursDetailsComponent,
        ForecastPopupComponent,
    ],
    exports: [
        TourRatingFormComponent,
        PurchasedToursComponent,
        PurchasedToursDetailsComponent,
    ],
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,
        TourAuthoringModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule
    ]
  })

export class MarketplaceModule { }
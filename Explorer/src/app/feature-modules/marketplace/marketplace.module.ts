import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceComponent } from './preference/preference/preference.component';
import { PreferenceFormComponent } from './preference-form/preference-form/preference-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourRatingComponent } from './tour-rating/tour-rating.component';



@NgModule({
  declarations: [
    PreferenceComponent,
    PreferenceFormComponent,
    TourRatingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports:[
    PreferenceFormComponent
  ]

})
export class MarketplaceModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckpointRequestReviewComponent } from './checkpoint-request-review/checkpoint-request-review/checkpoint-request-review.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    CheckpointRequestReviewComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    CheckpointRequestReviewComponent,
  ]
})
export class AdministrationModule { }
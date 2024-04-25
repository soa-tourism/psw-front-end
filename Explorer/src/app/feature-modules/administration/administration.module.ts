import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckpointRequestReviewComponent } from './checkpoint-request-review/checkpoint-request-review/checkpoint-request-review.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ApplicationGradeComponent } from './application-grade-form/application-grade.component';
import { GradeReviewComponent } from './grade-review/grade-review.component';
import { AccountsManagementComponent } from './accounts-management/accounts-management.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    CheckpointRequestReviewComponent,
    NotificationsComponent,
    ApplicationGradeComponent,
    AccountsManagementComponent, 
    GradeReviewComponent
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
    GradeReviewComponent,
    AccountsManagementComponent,
    ApplicationGradeComponent
  ]
})
export class AdministrationModule { }
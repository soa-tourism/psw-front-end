import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TourExecutionComponent } from './tour-execution/tour-execution.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SecretDialogComponent } from './secret-dialog/secret-dialog.component';
import { EncounterDialogComponent } from './encounter-dialog/encounter-dialog.component';
import { AbandonDialogComponent } from './abandon-dialog/abandon-dialog.component';
import { CompletedEncounterComponent } from './completed-encounter/completed-encounter.component';
import { UnlockSecretDialogComponent } from './unlock-secret-dialog/unlock-secret-dialog.component';
import { MarketplaceModule } from '../marketplace/marketplace.module';

@NgModule({
  declarations: [
    TourExecutionComponent,
    SimulatorComponent,
    SecretDialogComponent,
    EncounterDialogComponent,
    AbandonDialogComponent,
    CompletedEncounterComponent,
    UnlockSecretDialogComponent,
    ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MarketplaceModule,
    MatDialogModule,
  ],
  exports:[
    TourExecutionComponent,
    SimulatorComponent
  ]
})
export class TourExecutionModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { MyProfileComponent } from 'src/app/feature-modules/layout/my-profile/my-profile.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProfileAdministrationComponent } from 'src/app/feature-modules/layout/profile-administration/profile-administration.component';
import { CheckpointComponent } from 'src/app/feature-modules/tour-authoring/checkpoint/checkpoint.component';
import { TourFormComponent } from 'src/app/feature-modules/tour-authoring/tour-form/tour-form.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-authoring/tour-details/tour-details.component';
import { MapObjectComponent } from 'src/app/feature-modules/tour-authoring/map-object/map-object.component';
import { TourRatingComponent } from 'src/app/feature-modules/marketplace/tour-rating/tour-rating.component';
import { TourRatingFormComponent } from 'src/app/feature-modules/marketplace/tour-rating-form/tour-rating-form.component';
import { CheckpointRequestReviewComponent } from 'src/app/feature-modules/administration/checkpoint-request-review/checkpoint-request-review/checkpoint-request-review.component';
import { BlogPostTableComponent } from 'src/app/feature-modules/blog/blog-post-table/blog-post-table.component';
import { BlogPostComponent } from 'src/app/feature-modules/blog/blog-post/blog-post.component';
import { BlogPostManagementComponent } from 'src/app/feature-modules/blog/blog-post-management/blog-post-management.component';
import { SimulatorComponent } from 'src/app/feature-modules/tour-execution/simulator/simulator.component';
import { SocialProfileComponent } from 'src/app/feature-modules/user-social-profile/social-profile/social-profile.component';
import { TourEquipmentComponent } from 'src/app/feature-modules/tour-authoring/tour-equipment/tour-equipment.component';
import { TourOverviewComponent } from 'src/app/feature-modules/marketplace/tour-overview/tour-overview.component';
import { TourOverviewDetailsComponent } from 'src/app/feature-modules/marketplace/tour-overview-details/tour-overview-details.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/marketplace/purchased-tours/purchased-tours.component';
import { PurchasedToursDetailsComponent } from 'src/app/feature-modules/marketplace/purchased-tours-details/purchased-tours-details.component';
import { CheckpointSecretFormComponent } from 'src/app/feature-modules/tour-authoring/checkpoint-secret-form/checkpoint-secret-form.component';
import { TourExecutionComponent } from 'src/app/feature-modules/tour-execution/tour-execution/tour-execution.component';
import { NotificationsComponent } from 'src/app/feature-modules/administration/notifications/notifications.component';
import { EncounterFormComponent } from 'src/app/feature-modules/encounters/encounter-form/encounter-form.component';
import { TouristEncounterFormComponent } from 'src/app/feature-modules/encounters/tourist-encounter-form/tourist-encounter-form.component'; 
import { EncounterRequestComponent } from 'src/app/feature-modules/encounters/encounter-request/encounter-request.component';
import { TouristCurrentPositionComponent } from 'src/app/feature-modules/tourist-current-position/tourist-current-position.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password/reset-password.component';
import { VerificationSuccessComponent } from '../auth/verification-success/verification-success.component';
import { AccountsManagementComponent } from 'src/app/feature-modules/administration/accounts-management/accounts-management.component';
import { GradeReviewComponent } from 'src/app/feature-modules/administration/grade-review/grade-review.component';
import { ApplicationGradeComponent } from 'src/app/feature-modules/administration/application-grade-form/application-grade.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'reset-password/:secureToken', component: ResetPasswordComponent},
  { path: 'my-profile', 
    component: MyProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'notifications', pathMatch: 'full'}, 
      //ADMIN
      { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
      { path: 'checkpoint-request-review', component: CheckpointRequestReviewComponent, canActivate: [AuthGuard]},
      { path: 'accounts', component: AccountsManagementComponent, canActivate: [AuthGuard], },
      { path: 'grade-review', component: GradeReviewComponent, canActivate: [AuthGuard], },
      
      //TOURIST and AUTHOR
      { path: 'profile-info', component: ProfileAdministrationComponent, canActivate: [AuthGuard],},
      { path: 'my-blogs', component: BlogPostManagementComponent, canActivate: [AuthGuard]},
      //{ path: 'blogs/:id', component: BlogPostComponent, canActivate: [AuthGuard]},

      //TOURIST only
      { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard], },
      { path: 'tour-overview', component: TourOverviewComponent, canActivate:[AuthGuard]},
      { path: 'tour-overview-details/:id', component:TourOverviewDetailsComponent, canActivate: [AuthGuard]},
      { path: 'purchased-tours', component: PurchasedToursComponent, canActivate: [AuthGuard] },
      { path: 'purchased-tours-details/:id', component: PurchasedToursDetailsComponent, canActivate: [AuthGuard] },
      
      //AUTHOR only
      { path: 'tour', component: TourComponent,canActivate:[AuthGuard] },
      { path: 'checkpoint/:id', component: CheckpointComponent, canActivate: [AuthGuard] },
      { path: 'map-object', component: MapObjectComponent, canActivate: [AuthGuard] },

      //ALL USERS
      { path: 'tour-rating', component: TourRatingComponent, canActivate: [AuthGuard] },
      { path: 'social-profile', component: SocialProfileComponent, canActivate:[AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard],}
    ]
  },
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
  {path: 'profile-info', component: ProfileAdministrationComponent},
  { path: 'profile-info', component: ProfileAdministrationComponent },
  { path: 'accounts', component: AccountsManagementComponent, canActivate: [AuthGuard], },
  {path: 'checkpoint/:id', component: CheckpointComponent, canActivate: [AuthGuard]},
  {path: 'map-object', component: MapObjectComponent, canActivate: [AuthGuard]},
  {path: 'tour-form/:id', component: TourFormComponent,canActivate:[AuthGuard]},
  { path: 'tour', component: TourComponent, canActivate: [AuthGuard] },
  { path: 'application-grade', component: ApplicationGradeComponent },
  { path: 'grade-review', component: GradeReviewComponent },
  {path: 'checkpoint-request-review', component: CheckpointRequestReviewComponent},
  {path: 'tour-details/:id', component: TourDetailsComponent, canActivate: [AuthGuard]},
  {path: 'blogs', component: BlogPostTableComponent, canActivate: [AuthGuard]},
  {path: 'blogs/:id', component: BlogPostComponent, canActivate: [AuthGuard]},
  {path: 'tour-rating', component: TourRatingComponent, canActivate: [AuthGuard]},
  {path: 'tour-rating-form/:id', component: TourRatingFormComponent, canActivate: [AuthGuard]},
  {path: 'simulator', component: SimulatorComponent, canActivate:[AuthGuard]},
  {path: 'tour-equipment/:id',component:TourEquipmentComponent,canActivate:[AuthGuard]},
  {path: 'tour-overview',component:TourOverviewComponent,canActivate:[AuthGuard]},
  {path: 'tour-overview-details/:id',component:TourOverviewDetailsComponent,canActivate:[AuthGuard]},
  {path: 'tour-rating-form', component: TourRatingFormComponent, canActivate: [AuthGuard]},
  {path: 'social-profile', component: SocialProfileComponent, canActivate:[AuthGuard]},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'purchased-tours', component: PurchasedToursComponent, canActivate: [AuthGuard]},
  {path: 'purchased-tours-details/:id', component: PurchasedToursDetailsComponent, canActivate: [AuthGuard]},
  {path: 'checkpoint-secret/:id',component: CheckpointSecretFormComponent,canActivate:[AuthGuard]},
  {path: 'encounter-form/:id',component:EncounterFormComponent,canActivate:[AuthGuard]},
  {path: 'tour-execution/:tourId', component: TourExecutionComponent, canActivate: [AuthGuard]},
  {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard],},
  {path: 'tourist-encounter-form', component: TouristEncounterFormComponent, canActivate: [AuthGuard],},
  {path: 'encounter-request', component: EncounterRequestComponent, canActivate: [AuthGuard]},
  {path: 'current-location',component:TouristCurrentPositionComponent,canActivate:[AuthGuard]},
  {path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard]},
  {path: 'verification-success', component: VerificationSuccessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
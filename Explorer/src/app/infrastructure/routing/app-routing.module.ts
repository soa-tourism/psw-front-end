import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProfileAdministrationComponent } from 'src/app/feature-modules/layout/profile-administration/profile-administration.component';
import { AccountsManagementComponent } from 'src/app/feature-modules/administration/accounts/accounts-management/accounts-management.component';
import { ReportedIssuesComponent } from 'src/app/feature-modules/administration/reported-issues/reported-issues.component';
import { ReportingIssueComponent } from 'src/app/feature-modules/marketplace/reporting-issue/reporting-issue.component';
import { CheckpointComponent } from 'src/app/feature-modules/tour-authoring/checkpoint/checkpoint.component';
import { BlogCommentComponent } from 'src/app/feature-modules/blog/blog-comment/blog-comment.component';
import { PreferenceComponent } from 'src/app/feature-modules/marketplace/preference/preference/preference.component';
import { PreferenceFormComponent } from 'src/app/feature-modules/marketplace/preference-form/preference-form/preference-form.component';
import { TourFormComponent } from 'src/app/feature-modules/tour-authoring/tour-form/tour-form.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-authoring/tour-details/tour-details.component';
import { BlogPostComponent } from 'src/app/feature-modules/blog/blog-post/blog-post.component';
import { MapObjectComponent } from 'src/app/feature-modules/tour-authoring/map-object/map-object.component';
import { ClubComponent } from 'src/app/feature-modules/administration/club/club.component';
import { ClubMembersComponent } from 'src/app/feature-modules/administration/club-members/club-members.component';
import { ClubInvitationsComponent } from 'src/app/feature-modules/administration/club-invitations/club-invitations.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'club', component: ClubComponent},
  {path: 'profile-info', component: ProfileAdministrationComponent},
  {path: 'profile-info', component: ProfileAdministrationComponent},
  {path: 'accounts', component: AccountsManagementComponent, canActivate: [AuthGuard],},
  {path: 'reported-issues', component: ReportedIssuesComponent, canActivate: [AuthGuard],},
  {path: 'reporting-issues', component: ReportingIssueComponent, canActivate: [AuthGuard],},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
  {path: 'checkpoint', component: CheckpointComponent, canActivate: [AuthGuard]},
  {path: 'map-object', component: MapObjectComponent, canActivate: [AuthGuard]},
  {path: 'tour-form', component: TourFormComponent,canActivate:[AuthGuard]},
  {path: 'tour', component: TourComponent,canActivate:[AuthGuard]},
  {path: 'preference-form', component: PreferenceFormComponent, canActivate:[AuthGuard]},
  {path: 'preference', component: PreferenceComponent, canActivate:[AuthGuard]},
  {path: 'tour-details/:id',component:TourDetailsComponent,canActivate:[AuthGuard]},
  {path: 'blog-post', component: BlogPostComponent, canActivate: [AuthGuard]},
  {path: 'blog-comments', component: BlogCommentComponent, canActivate: [AuthGuard]},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
  {path: 'club', component: ClubComponent},
  {path: 'club-members/:id', component: ClubMembersComponent},
  {path: 'invitations', component: ClubInvitationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
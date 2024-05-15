import { Component, OnInit } from '@angular/core';
import { SocialProfile } from '../model/social-profile.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserSocialProfileService } from '../user-social-profile.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-social-profile',
  templateUrl: './social-profile.component.html',
  styleUrls: ['./social-profile.component.css']
})
export class SocialProfileComponent implements OnInit {
  user: User | undefined;
  socialProfile: SocialProfile;
  recommended: SocialProfile[];
  searched: SocialProfile[] | undefined;
  searchProfiles: string = "";
  
  constructor(private service: UserSocialProfileService, private authService: AuthService){
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getSocialProfile(this.user.id);
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getSocialProfile(this.user.id);
    });
  }

  getSocialProfile(id: number): void {
    this.service.getSocilaProfile(id).subscribe((result: SocialProfile) => {
      this.socialProfile = result;
    });
    this.service.getSocilaProfileRecommended(id).subscribe(
      (result: any) => {
        this.recommended = result.socialProfiles;
        this.service.getFollowers(id).subscribe((result:any)=>{
          this.socialProfile.followers = result.socialProfiles;
          this.service.getFollowing(id).subscribe((result:any)=>{
            this.socialProfile.following = result.socialProfiles;
          });
        });
      });
  }

  onFollowClick(followedId?: number): void {
    if(this.user && followedId){
      this.service.follow(followedId,this.user.id).subscribe((result: SocialProfile) => {
        this.getSocialProfile(this.user!.id);
      });
    }
  }

  onUnfollowClick(followedId?: number): void {
    if(this.user && followedId){
      this.service.unfollow(this.user.id, followedId).subscribe((result: SocialProfile) => {
        this.getSocialProfile(this.user!.id);
      });
    }
  }

  search(): void {
    if (this.searchProfiles) {
      this.service.searchSocialProfilesByUsername(this.searchProfiles).subscribe(
        (result: any) => {
          console.log("Received result:", result); // Log the result
          // Check if result is an array
          if (Array.isArray(result.socialProfiles)) {
            // Filter out profiles already in following and the logged-in user
            this.searched = result.socialProfiles.filter((profile: SocialProfile) => {
              if (profile.userId !== this.socialProfile.userId) {
                return !this.socialProfile.following.some(followed => followed.userId === profile.userId);
              }
              return false;
            });
          } else {
            console.error("Result is not an array:", result); // Log error if result is not an array
          }
        },
        error => {
          console.error("Error occurred during search:", error); // Log any errors
        }
      );
    }
  }
  
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocialProfile } from './model/social-profile.model';
import { environment } from 'src/env/environment';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class UserSocialProfileService {
  [x: string]: any;

  constructor(private http: HttpClient) { }

  getSocilaProfile(id: number): Observable<SocialProfile> {
    return this.http.get<SocialProfile>(environment.apiHost + 'social-profile/get/' + id);
  }

  getSocilaProfileRecommended(id: number): Observable<PagedResults<SocialProfile>> {
    return this.http.get<PagedResults<SocialProfile>>(environment.apiHost + 'social-profile/get-recommended/' + id);
  }

  follow(userId: number, followerId: number): Observable<SocialProfile> {
    return this.http.put<SocialProfile>(environment.apiHost + 'social-profile/follow/' + userId + '/' + followerId, null);
  }

  unfollow(followedId: number, userId: number): Observable<SocialProfile>{
    return this.http.delete<SocialProfile>(environment.apiHost + 'social-profile/unfollow/' + followedId + '/' + userId);
  }

  searchSocialProfilesByUsername(username: string): Observable<SocialProfile> {
    return this.http.get<SocialProfile>(environment.apiHost + 'social-profile/search/' + username);
  }
}

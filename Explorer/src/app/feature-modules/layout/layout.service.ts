import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { ProfileInfo } from './model/profileInfo.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { BlogPost } from '../blog/model/blog-post.model';
import { Tourist } from './model/tourist.model';


@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private apiUrl2 = 'https://nominatim.openstreetmap.org/reverse?format=json';

  constructor(private http: HttpClient, private authService: AuthService, private tokenStorage: TokenStorage) { }

  fetchCurrentUser(): Observable<any> {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const personId = jwtHelperService.decodeToken(accessToken).id;
    if (personId) {
      return this.http.get(environment.apiHost + `profile-administration/edit/${personId}`);
    }
    return of(null); 
  }

  fetchCurrentAdmin(): Observable<any> {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const personId = jwtHelperService.decodeToken(accessToken).id;
    if (personId) {
      return this.http.get(environment.apiHost + `profile-administration/admin-edit/${personId}`);
    }
    return of(null); 
  }

  saveNewInfo(profileInfo: ProfileInfo, formData: FormData): Observable<any> {
    const options = { headers: new HttpHeaders() };

    formData.append('id', profileInfo.id.toString());
    formData.append('userId', profileInfo.userId.toString());
    formData.append('name', profileInfo.name);
    formData.append('surname', profileInfo.surname);
    formData.append('email', profileInfo.email);
    formData.append('biography', profileInfo.biography);
    formData.append('motto', profileInfo.motto);

    // Assuming that profilePicture is a File
    if (profileInfo.profilePicture instanceof File) {
      formData.append('profilePicture', profileInfo.profilePicture, profileInfo.profilePicture.name);
    }

    // Assuming profilePictureUrl is a string
    formData.append('profilePictureUrl', profileInfo.profilePictureUrl);

    return this.http.put(environment.apiHost + 'profile-administration/edit', formData, options);
    
  }

  saveNewAdminInfo(profileInfo: ProfileInfo, formData: FormData): Observable<any> {
    const options = { headers: new HttpHeaders() };
    //return this.http.put(environment.apiHost + 'profile-administration/edit', formData, options);
    formData.append('id', profileInfo.id.toString());
    formData.append('userId', profileInfo.userId.toString());
    formData.append('name', profileInfo.name);
    formData.append('surname', profileInfo.surname);
    formData.append('email', profileInfo.email);
    formData.append('biography', profileInfo.biography);
    formData.append('motto', profileInfo.motto);

    // Assuming that profilePicture is a File
    if (profileInfo.profilePicture instanceof File) {
      formData.append('profilePicture', profileInfo.profilePicture, profileInfo.profilePicture.name);
    }

    // Assuming profilePictureUrl is a string
    formData.append('profilePictureUrl', profileInfo.profilePictureUrl);

    return this.http.put(environment.apiHost + 'profile-administration/admin-edit', formData, options);
  }

  getPlaceInfo(latitude: number, longitude: number): Observable<any> {
      const url = `${this.apiUrl2}&lat=${latitude}&lon=${longitude}`;

      return this.http.get(url);
  }

  getTopRatedBlogs(count: number): Observable<BlogPost[]>{
    return this.http.get<BlogPost[]>(environment.apiHost + 'langing-page/top-rated-blogs/' + count);
  }

  getTourist(userId: number): Observable<Tourist>{
    return this.http.get<Tourist>(environment.apiHost + 'profile-administration/edit/getTourist/' + userId);
  }
  checkRatingExistence( personId: number): Observable<boolean> {
   return this.http.get<boolean>(environment.apiHost + 'langing-page/app-rating-exists/' + personId);
  }


  
}
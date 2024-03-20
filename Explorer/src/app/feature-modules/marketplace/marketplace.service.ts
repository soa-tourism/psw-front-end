import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ReportedIssue } from '../administration/model/reported-issue.model';
import { TourPreference } from './model/preference.model';
import { TourRating } from './model/tour-rating.model';
import { OrderItem } from './model/order-item.model';
import { ShoppingCart } from './model/shopping-cart.model';
import { TouristPosition } from '../tour-execution/model/position.model';
import { PublishedTour } from './model/published-tour.model';
import { TourExecution } from '../tour-execution/model/tour_execution.model';
import { MapObject } from '../tour-authoring/model/map-object.model';
import { PublicCheckpoint } from '../tour-execution/model/public_checkpoint.model';
import { PurchasedTourPreview } from '../tour-execution/model/purchased_tour_preview.model';
import { TouristWallet } from './model/tourist-wallet.model';
import { CompositeForm } from './model/composite-create';
import { CompositePreview } from './model/composite-preview';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Coupon } from './model/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  [x: string]: any;
  getCheckpointsByTour(tourId: number) {
      throw new Error('Method not implemented.');
  }
  getCheckpoints() {
      throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) { }

  addReportedIssue(reportedIssue: string): Observable<ReportedIssue> {
    return this.http.post<ReportedIssue>(environment.apiHost + 'tourist/reportingIssue/' + reportedIssue,null);
  }

  addTourPreference(preference: TourPreference): Observable<TourPreference> {
    return this.http.post<TourPreference>(environment.apiHost + 'tourism/preference', preference);
  }

  updateTourPreference(preference: TourPreference): Observable<TourPreference> {
    return this.http.put<TourPreference>(environment.apiHost + 'tourism/preference/' + preference.id, preference);
  }

  getTourPreference(id: number): Observable<TourPreference> {
    return this.http.get<TourPreference>(environment.apiHost + 'tourism/preference/'+id)
  }

  deleteTourPreference(id: number): Observable<TourPreference> {
    return this.http.delete<TourPreference>(environment.apiHost + 'tourism/preference/' + id);
  }

  getTourRating(user: User): Observable<PagedResults<TourRating>> {
    let url: string;
    let params = new HttpParams();

    switch (user.role) {
      case 'author':
        url = 'author/tours/reviews';
        params = params.set('authorId', user.id.toString());
        break;
      case 'tourist':
        url = 'tourist/tours/reviews';
        params = params.set('touristId', user.id.toString());
        break;
      default:
        throw new Error('Invalid user type');
    }

    return this.http.get<PagedResults<TourRating>>(environment.apiHost + url, { params });
  }

  addTourRating(ratingForm: FormData): Observable<TourRating> {
    return this.http.post<TourRating>(environment.apiHost + 'tourist/tours/reviews', ratingForm);
  }

  updateTourRating(rating: TourRating): Observable<TourRating> {
    return this.http.put<TourRating>(environment.apiHost + 'tourist/tours/reviews/' + rating.id, rating);
  }

  addTouristPosition(position: TouristPosition): Observable<TouristPosition> {
    return this.http.post<TouristPosition>(environment.apiHost + 'tourism/position', position);
  }

  updateTouristPosition(position: TouristPosition): Observable<TouristPosition> {
    return this.http.put<TouristPosition>(environment.apiHost + 'tourism/position/' + position.id, position);
  }

  getTouristPosition(id: number): Observable<TouristPosition> {
    return this.http.get<TouristPosition>(environment.apiHost + 'tourism/position/'+id)
  }

  deleteTouristPosition(id: number): Observable<TouristPosition> {
    return this.http.delete<TouristPosition>(environment.apiHost + 'tourism/position/' + id);
  }

  startShoppingSession(touristId: number): Observable<any> {
    const params = new HttpParams().set('touristId', touristId.toString());
    return this.http.post<any>(environment.apiHost + 'shopping/shopping-cart/session/', null, { params });
  }

  getShoppingCart(touristId: number): Observable<ShoppingCart> {
    const params = new HttpParams().set('touristId', touristId.toString());
    return this.http.get<ShoppingCart>(environment.apiHost + 'shopping/shopping-cart/', { params });
  }

  addItemToShoppingCart(item: OrderItem): Observable<ShoppingCart> {
    return this.http.put<ShoppingCart>(environment.apiHost + 'shopping/shopping-cart/add', item);
  }

  removeItemFromShoppingCart(item: OrderItem): Observable<ShoppingCart> {
    return this.http.put<ShoppingCart>(environment.apiHost + 'shopping/shopping-cart/remove', item);
  }

  shoppingCartCheckOut(id: number, coupon: string = ""): Observable<ShoppingCart> {
    const params = new HttpParams()
      .set('touristId', id.toString())
      .set('coupon', coupon)
    return this.http.put<ShoppingCart>(environment.apiHost + 'shopping/shopping-cart/checkout', null, { params });
  }

  getTouristsPurchasedTours(id: number): Observable<PurchasedTourPreview[]> {
    const params = new HttpParams().set('touristId', id.toString());
    return this.http.get<PurchasedTourPreview[]>(environment.apiHost + 'shopping/purchased-tours', { params })
  }

  getPurchasedTourDetails(tourId: number): Observable<PurchasedTourPreview> {
    return this.http.get<PurchasedTourPreview>(environment.apiHost + 'shopping/purchased-tours/details/' + tourId)
  }
  
  // TODO
  getPublishedTours():Observable<PublishedTour[]> {
    return this.http.get<PublishedTour[]>(environment.apiHost + 'tourist/published-tours')
  }

  getPublishedTour(id: number): Observable<PublishedTour> {
    return this.http.get<PublishedTour>(environment.apiHost + 'tourist/published-tours/' + id);
  }

  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  updateCartItemCount(count: number): void {
    this.cartItemCountSubject.next(count);
  }

  getPublicTours(): Observable<PublishedTour[]>{
    return this.http.get<PublishedTour[]>(environment.apiHost + 'tourist/published-tours') 
  }
  startExecution(tourId: number, touristId: number): Observable<TourExecution>{
    return this.http.post<TourExecution>(environment.apiHost + 'tour-execution/' + touristId, tourId);
  }

  getAverageRating(id:number): Observable<number> {
    return this.http.get<number>(environment.apiHost + 'tourist/shopping/averageRating/' + id)
  }

  getRating(id:number): Observable<TourRating> {
    return this.http.get<TourRating>(environment.apiHost + 'tourist/tours/review/' + id)
  }

  getMapObjects(): Observable<PagedResults<MapObject>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<MapObject>>(environment.apiHost + 'map-object', {params: queryParams});
  }

  getPublicCheckpoints(): Observable<PagedResults<PublicCheckpoint>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<PublicCheckpoint>>(environment.apiHost + 'administration/publicCheckpoint');
  }

  getAdventureCoins(id:number): Observable<TouristWallet> {
    return this.http.get<TouristWallet>(environment.apiHost + 'tourist/wallet/get-adventure-coins/' + id)
  }

  paymentAdventureCoins(id:number, coins: number): Observable<TouristWallet> {
    return this.http.put<TouristWallet>(environment.apiHost + 'tourist/wallet/payment-adventure-coins/' + id + '/' + coins, null)
  }

  getByCode(couponText: string): Observable<Coupon> {
    return this.http.get<Coupon>(environment.apiHost + 'shopping/shopping-cart/get-by-code/' + couponText);
  }
}
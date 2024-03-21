import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TourExecution } from './model/tour_execution.model';
import { TouristPosition } from './model/position.model';
import { MapObject } from '../tour-authoring/model/map-object.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { PublicCheckpoint } from './model/public_checkpoint.model';
import { EncounterExecution } from '../encounters/model/encounterExecution.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  // simulator
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

  // TourExecution
  getTourExecution(tourId: number): Observable<TourExecution> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("tourId",tourId);
    return this.http.get<TourExecution>(environment.apiHost + 'tour-execution', {params: queryParams});
  }

  startExecution(tourId: number): Observable<TourExecution>{
    return this.http.post<TourExecution>(environment.apiHost + 'tour-execution' + "/" + tourId, null);
  }

  abandon(id: number): Observable<TourExecution>{
    return this.http.put<TourExecution>(environment.apiHost + 'tour-execution/abandoned/', id);
  }

  registerPosition(id: number, position: TouristPosition): Observable<TourExecution>{
    return this.http.put<TourExecution>(environment.apiHost + 'tour-execution/' + id, position);
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

  // Encounters
  getEncounters(tourId: number, touristLongitude: number, touristLatitude: number): Observable<EncounterExecution>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("touristLatitude", touristLatitude);
    queryParams = queryParams.append("touristLongitude", touristLongitude);
    return this.http.get<EncounterExecution>(environment.apiHost + 'tourist/encounter-execution/get-by-tour/' + tourId, {params: queryParams});
  }

  activateEncounter(id: number, touristLongitude: number, touristLatitude: number): Observable<EncounterExecution>{
    var form = new FormData();
    form.append('touristLatitude', touristLatitude.toString());
    form.append('touristLongitude', touristLongitude.toString());
    return this.http.put<EncounterExecution>(environment.apiHost + 'tourist/encounter-execution/activate/' + id, form);
  }

  completeEncounter(id: number, touristLongitude: number, touristLatitude : number): Observable<EncounterExecution>{
    var form = new FormData();
    form.append('touristLatitude', touristLatitude.toString());
    form.append('touristLongitude', touristLongitude.toString());
    return this.http.put<EncounterExecution>(environment.apiHost + 'tourist/encounter-execution/completed/' + id, form);
  }

  getActiveEncounters(tourId: number): Observable<EncounterExecution[]>{
    return this.http.get<EncounterExecution[]>(environment.apiHost + 'tourist/encounter-execution/active/by-tour/' + tourId);
  }

  checkIfInRange(tourId: number, encounterExecutionId: number, touristLongitude: number, touristLatitude: number): Observable<EncounterExecution>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("touristLatitude", touristLatitude);
    queryParams = queryParams.append("touristLongitude", touristLongitude);
    return this.http.get<EncounterExecution>(environment.apiHost + 'tourist/encounter-execution/social/checkRange/' + encounterExecutionId + "/" + tourId, {params: queryParams});
  }

  checkIfInRangeLocation(tourId: number, encounterExecutionId: number, touristLongitude: number, touristLatitude: number): Observable<EncounterExecution>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("touristLatitude", touristLatitude);
    queryParams = queryParams.append("touristLongitude", touristLongitude);
    return this.http.get<EncounterExecution>(environment.apiHost + 'tourist/encounter-execution/location/checkRange/' + encounterExecutionId + "/" + tourId, {params: queryParams});
  }

  getCompleted() : Observable<EncounterExecution[]>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<EncounterExecution[]>(environment.apiHost + 'tourist/encounter-execution/get-all-completed', {params: queryParams});
  }
}

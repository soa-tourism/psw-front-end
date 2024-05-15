import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Checkpoint } from './model/checkpoint.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Equipment } from './model/equipment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from './model/tour.model';
import { MapObject } from './model/map-object.model';
import { TourTimes } from './model/tourTimes.model';
import { CheckpointSecret } from './model/checkpointSecret.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PublicCheckpoint } from '../tour-execution/model/public_checkpoint.model';
import { PublishedTour } from '../marketplace/model/published-tour.model';


@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  user: User;
  constructor(private http: HttpClient, private authService: AuthService) 
  { 
    this.authService.user$.subscribe( result =>{
      this.user= result;
    });
  }
  
  // TODO MAPS AND CHECKPOINTS
  getCheckpoints(): Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>(environment.apiHost + 'administration/checkpoint')
  }

  getCheckpoint(id:string): Observable<Checkpoint> {
    return this.http.get<Checkpoint>(environment.apiHost + 'administration/checkpoint/details/'+id);
  }

  getCheckpointsByTour(id: string): Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>(environment.apiHost + 'administration/checkpoint/' + id)
  }

  deleteCheckpoint(id: string): Observable<Checkpoint> {
    return this.http.delete<Checkpoint>(environment.apiHost + 'administration/checkpoint/' + id);
  }

  addCheckpoint(checkpoint: FormData, status: string): Observable<Checkpoint> {
    const checkpointData: any = {};
    const checkp: any = {};
  
    // Iterate over FormData keys and values
    checkpoint.forEach((value, key) => {
      if (key === 'checkpointSecret' || key === 'currentPicture' || key === 'currentPointPicture' || key === 'showedPicture'|| key === 'showedPointPicture' || key === 'viewSecretMessage'|| key === 'visibleSecret'){
        
      } else { 
       if (key ==="authorId" || key === "encounterId" || key==="longitude" || key==="latitude" || key==="requiredTimeInSeconds"){
        checkp[key] = Number(value);
       }
        else {
          if (key === 'isSecretPrerequisite'){
            checkp[key] = Boolean(value);  
          } else {
            checkp[key] = value;
          }
        }
      }
    });
  
    checkp['pictures']=[];
    checkp['id']="";

    // Add the status to the JSON data
    checkpointData['checkpoint'] = checkp;
    checkpointData['status'] = status;
    checkpointData['pictures'] = [];
    console.log(checkpointData)
    // Send the JSON data in the request
    return this.http.post<Checkpoint>(`${environment.apiHost}administration/checkpoint/create/${status}`, checkpointData);
  }

  updateCheckpoint(checkpointId: string, checkpointFormData: FormData): Observable<Checkpoint> {
    const checkpointData: any = {};
    const checkp: any = {};
  
    // Iterate over FormData keys and values
    checkpointFormData.forEach((value, key) => {
      if (key ==="authorId" || key === "encounterId" || key==="longitude" || key==="latitude" || key==="requiredTimeInSeconds"){
        checkp[key] = Number(value);
      }
      else {
        if (key === 'isSecretPrerequisite'){
          checkp[key] = Boolean(value);  
        } else {
          checkp[key] = value;
        }
      }
    });
    checkp['pictures']=[];
    // Add the status to the JSON data
    checkpointData['checkpoint'] = checkp;
    checkpointData['id'] = checkpointId;
    checkpointData['pictures'] = [];
    console.log(checkpointData)
    return this.http.put<Checkpoint>(`${environment.apiHost}administration/checkpoint/create/${checkpointId}`, checkpointData);
  }

  addCheckpointSecret(checkpointSecret: FormData, id: string): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(environment.apiHost + 'administration/checkpoint/createSecret/' + id, checkpointSecret);
  }

  updateCheckpointSecret(checkpointSecret: CheckpointSecret,id:number): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(environment.apiHost + 'administration/checkpoint/updateSecret/' + id, checkpointSecret);
  }

  getMapObjects(): Observable<PagedResults<MapObject>> {
    return this.http.get<PagedResults<MapObject>>(environment.apiHost + 'administration/mapObject');
  }

  deleteMapObject(id: number): Observable<MapObject> {
    return this.http.delete<MapObject>(environment.apiHost + 'administration/mapobject/' + id);
  }

  addMapObject(mapObject: MapObject, userId: number, status: string, formData: FormData): Observable<MapObject> {
    const options = { headers: new HttpHeaders() };

    formData.append('longitude', mapObject.longitude.toString()),
    formData.append('latitude', mapObject.latitude.toString()),
    formData.append('name', mapObject.name),
    formData.append('category', mapObject.category)
    if (mapObject.picture instanceof File) {
      formData.append('picture', mapObject.picture, mapObject.picture.name);
    }

    // Assuming profilePictureUrl is a string
    formData.append('pictureURL', mapObject.pictureURL);
    return this.http.post<MapObject>(environment.apiHost + `administration/mapobject/create/${userId}/${status}`, formData, options);
  }

  updateMapObject(mapObject: MapObject, formData: FormData): Observable<MapObject> {
    const options = { headers: new HttpHeaders() };

    formData.append('id', (mapObject.id !== undefined) ? mapObject.id.toString() : '');
    formData.append('longitude', mapObject.longitude.toString()),
    formData.append('latitude', mapObject.latitude.toString()),
    formData.append('name', mapObject.name),
    formData.append('category', mapObject.category)
    if (mapObject.picture instanceof File) {
      formData.append('picture', mapObject.picture, mapObject.picture.name);
    }

    // Assuming profilePictureUrl is a string
    formData.append('pictureURL', mapObject.pictureURL);
    return this.http.put<MapObject>(environment.apiHost + 'administration/mapobject/' + mapObject.id, formData, options);
  }
  // ---------------------------------------------------------

  get(id: string): Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'administration/tours/' + id);
  }

  addTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(environment.apiHost + 'administration/tours', tour);
  }

  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'administration/tours/' + tour.id, tour);
  }

  deleteTour(id: string): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + 'administration/tours/' + id);
  }

  getToursByAuthor(id: number): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'administration/tours/author/' + id)
  }

  addEquipment(tourId: string, equipmentId: string): Observable<Tour> {
    return this.http.post<Tour>(`${environment.apiHost}administration/tours/${tourId}/equipment/${equipmentId}`, null);
  }

  removeEquipment(tourId: string, equipmentId: string): Observable<Tour> {
    return this.http.delete<Tour>(`${environment.apiHost}administration/tours/${tourId}/equipment/${equipmentId}`);
  }

  getAvailableEquipment(tourId: string, currentEquipmentIds: string[]): Observable<PagedResults<Equipment>> {
    let params = new HttpParams();
    params = params.set('id', tourId);
    if (currentEquipmentIds.length > 0) {
      params = params.set('equipmentIds', currentEquipmentIds.join(','));
    }
    console.log(params)
    return this.http.get<PagedResults<Equipment>>(`${environment.apiHost}tours/${tourId}/equipment/available`, { params });
  }


  // TODO TOUR OVERVIEW FOR AUTHOR
  publishTour(tourId: string){
    console.log(tourId)
    return this.http.put<Tour>(environment.apiHost + 'administration/tours/publishedTours/' + tourId, null);
  }

  archiveTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'administration/tours/archivedTours/' + tour.id, null);
  }

  addTourTransportation(tourId: string, tour: TourTimes){
    return this.http.put<Tour>(environment.apiHost + 'administration/tours/tourTime/' + tourId, tour);
  }
  // ---------------------------------------------------------

  getPublicCheckpoints(): Observable<PagedResults<PublicCheckpoint>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<PublicCheckpoint>>(environment.apiHost + 'administration/publicCheckpoint');
  }
  
  getPublicCheckpointsAtPlace(longitude:number, latitude:number): Observable<PagedResults<PublicCheckpoint>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<PublicCheckpoint>>(environment.apiHost + 'administration/publicCheckpoint/atPlace/'+longitude+'/'+latitude);
  }
}
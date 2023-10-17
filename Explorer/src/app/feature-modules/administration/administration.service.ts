import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubMemebrshipRequest } from './model/club-membership-request.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  //club membership requests
  getClubMembershipRequests(): Observable<PagedResults<ClubMemebrshipRequest>> {
    return this.http.get<PagedResults<ClubMemebrshipRequest>>(environment.apiHost + 'request')
  }
  
  deleteClubMembershipRequest(id: number): Observable<ClubMemebrshipRequest> {
    return this.http.delete<ClubMemebrshipRequest>(environment.apiHost + 'request/deleteRequest/' + id);
  }

}

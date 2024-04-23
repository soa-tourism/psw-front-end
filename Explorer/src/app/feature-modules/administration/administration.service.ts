import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Notification } from './model/notification.model';
import { CheckpointRequest } from './model/checkpoint-request.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  [x: string]: any;

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: string): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  getAllUsers(): Observable<PagedResults<User>> {
    return this.http.get<PagedResults<User>>('https://localhost:44333/api/user');
  }

  //checkpoint requests
  getAllCheckpointRequests(): Observable<CheckpointRequest[]> {
    return this.http.get<CheckpointRequest[]>(environment.apiHost + 'administration/checkpointequests');
  }

  acceptCheckpointRequest(requestId: number, comment: string): Observable<CheckpointRequest> {
    return this.http.post<CheckpointRequest>(environment.apiHost + 'administration/publicCheckpoint/create/' + requestId + '/' + comment, null);
  }

  rejectCheckpointRequest(requestId: number, comment: string): Observable<CheckpointRequest> {
    return this.http.put<CheckpointRequest>(environment.apiHost + 'administration/checkpointequests/reject/' + requestId + '/' + comment, null);
  }

  // notifications
  getNotification(id: number, role: string): Observable<Notification>{
    return this.http.get<Notification>(environment.apiHost + role + `/notifications/${id}`);
  }
  deleteNotification(id: number, role:string): Observable<Notification> {
    return this.http.delete<Notification>(environment.apiHost + role + `/notifications/${id}`);
  }
  updateNotification(role:string, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(environment.apiHost + role + `/notifications/` + notification.id, notification);
  }
  getAllNotificationsByUser(userId: number, role: string): Observable<PagedResults<Notification>>{
    return this.http.get<PagedResults<Notification>>(environment.apiHost + role + `/notifications/get-all/${userId}`);
  }
  getUnreadNotificationsByUser(userId: number, role: string): Observable<PagedResults<Notification>>{
    return this.http.get<PagedResults<Notification>>(environment.apiHost + role + `/notifications/get-unread/${userId}`);
  }
}

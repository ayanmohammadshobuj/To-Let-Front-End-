import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private apiService: ApiService) {}

  getUserNotifications(userId: string): Observable<Notification[]> {
    return this.apiService.get<Notification[]>(`/api/notifications/${userId}`);
  }

  getUnreadNotifications(userId: string): Observable<Notification[]> {
    return this.apiService.get<Notification[]>(`/api/notifications/${userId}/unread`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.apiService.put(`/api/notifications/${notificationId}/read`, {});
  }
}

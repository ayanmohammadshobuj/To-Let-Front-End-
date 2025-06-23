// src/app/features/user/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { User} from "../../../core/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUserById(userId: string): Observable<User> {
    return this.apiService.get<User>(`/api/users/${userId}`);
  }

  updateUser(userId: string, userDetails: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`/api/users/${userId}`, userDetails);
  }

  deleteUser(userId: string): Observable<any> {
    return this.apiService.delete(`/api/users/${userId}`);
  }

  uploadProfileImage(userId: string, image: File): Observable<User> {
    const formData = new FormData();
    formData.append('image', image);
    return this.apiService.postFormData<User>(`/api/users/${userId}/profile-image`, formData);
  }

  getProfileImageUrl(userId: string): string {
    return `${this.apiService.getBaseUrl()}/api/users/${userId}/profile-image`;
  }
}

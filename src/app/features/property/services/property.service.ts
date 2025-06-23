// src/app/features/property/services/property.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private apiService: ApiService) {}

  createProperty(propertyData: any, images?: File[]): Observable<Property> {
    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(propertyData)], { type: 'application/json' }));

    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    return this.apiService.postFormData<Property>('/api/posts', formData);
  }

  getAllProperties(): Observable<Property[]> {
    return this.apiService.get<Property[]>('/api/posts');
  }

  getPropertyById(id: number): Observable<Property> {
    return this.apiService.get<Property>(`/api/posts/${id}`);
  }

  getMyProperties(): Observable<Property[]> {
    return this.apiService.get<Property[]>('/api/posts/my-posts');
  }

  getPropertiesByUserId(userId: string): Observable<Property[]> {
    return this.apiService.get<Property[]>(`/api/posts/user/${userId}`);
  }

  updateProperty(id: number, propertyData: any, images?: File[]): Observable<Property> {
    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(propertyData)], { type: 'application/json' }));

    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    return this.apiService.putFormData<Property>(`/api/posts/${id}`, formData);
  }

  deleteProperty(id: number): Observable<any> {
    return this.apiService.delete(`/api/posts/${id}`);
  }

  getTrendingProperties(): Observable<Property[]> {
    return this.apiService.get<Property[]>('/api/posts/trending');
  }

  getRecentlyViewedProperties(): Observable<Property[]> {
    return this.apiService.get<Property[]>('/api/posts/recently-viewed');
  }
}

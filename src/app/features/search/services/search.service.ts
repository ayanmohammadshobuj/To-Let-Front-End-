// src/app/features/search/services/search.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { Property } from '../../property/models/property.model';
import { SearchCriteria } from '../models/search-criteria.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private apiService: ApiService) {}

  searchProperties(criteria: SearchCriteria): Observable<Property[]> {
    let params = new HttpParams();

    if (criteria.serviceType) {
      params = params.append('serviceType', criteria.serviceType);
    }

    if (criteria.houseType) {
      params = params.append('houseType', criteria.houseType);
    }

    if (criteria.minPrice) {
      params = params.append('minPrice', criteria.minPrice.toString());
    }

    if (criteria.maxPrice) {
      params = params.append('maxPrice', criteria.maxPrice.toString());
    }

    if (criteria.bedrooms) {
      params = params.append('bedrooms', criteria.bedrooms.toString());
    }

    if (criteria.bathrooms) {
      params = params.append('bathrooms', criteria.bathrooms.toString());
    }

    if (criteria.area) {
      params = params.append('area', criteria.area.toString());
    }

    if (criteria.district) {
      params = params.append('district', criteria.district);
    }

    if (criteria.furnished !== undefined) {
      params = params.append('furnished', criteria.furnished.toString());
    }

    return this.apiService.get<Property[]>('/api/posts/search', params);
  }
}

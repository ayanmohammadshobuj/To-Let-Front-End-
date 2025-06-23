// src/app/features/user/services/address.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Address } from '../models/address.model';
import { AddressType } from '../models/address-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  constructor(private apiService: ApiService) {}

  addAddress(userId: string, address: Address): Observable<Address> {
    return this.apiService.post<Address>(`/api/users/${userId}/addresses`, address);
  }

  getAddress(userId: string, addressId: number): Observable<Address> {
    return this.apiService.get<Address>(`/api/users/${userId}/addresses/${addressId}`);
  }

  getAllAddresses(userId: string): Observable<Address[]> {
    return this.apiService.get<Address[]>(`/api/users/${userId}/addresses`);
  }

  updateAddress(userId: string, addressId: number, addressDetails: Partial<Address>): Observable<Address> {
    return this.apiService.put<Address>(`/api/users/${userId}/addresses/${addressId}`, addressDetails);
  }

  deleteAddress(userId: string, addressId: number): Observable<any> {
    return this.apiService.delete(`/api/users/${userId}/addresses/${addressId}`);
  }

  setDefaultAddress(userId: string, addressId: number): Observable<Address> {
    return this.apiService.put<Address>(`/api/users/${userId}/addresses/${addressId}/default`, {});
  }

  getDefaultAddress(userId: string): Observable<Address> {
    return this.apiService.get<Address>(`/api/users/${userId}/addresses/default`);
  }

  getAddressesByType(userId: string, addressType: AddressType): Observable<Address[]> {
    return this.apiService.get<Address[]>(`/api/users/${userId}/addresses/type/${addressType}`);
  }

  getNearbyAddresses(latitude: number, longitude: number, district?: string, radiusInKm: number = 10): Observable<Address[]> {
    let path = `/api/users/${userId}/addresses/nearby?latitude=${latitude}&longitude=${longitude}&radiusInKm=${radiusInKm}`;
    if (district) {
      path += `&district=${district}`;
    }
    return this.apiService.get<Address[]>(path);
  }
}

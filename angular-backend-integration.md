# Angular Backend Integration Guide for To-Let Project

This document provides guidance on how to implement Angular services that integrate with the To-Let backend microservices.

## API Service Implementation

### Base API Service

First, create a base API service in the Core module that all feature-specific services will extend:

```typescript
// src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    return throwError(() => error);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: object = {}): Observable<T> {
    return this.http.put<T>(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: object = {}): Observable<T> {
    return this.http.post<T>(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  // For multipart/form-data requests (file uploads)
  postFormData<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, formData)
      .pipe(catchError(this.formatErrors));
  }

  putFormData<T>(path: string, formData: FormData): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${path}`, formData)
      .pipe(catchError(this.formatErrors));
  }
}
```

### Environment Configuration

Set up the environment files to include the API URL:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  websocketUrl: 'ws://localhost:8080/ws-chat'
};
```

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.to-let-app.com',
  websocketUrl: 'wss://api.to-let-app.com/ws-chat'
};
```

## Feature-Specific Services

### Authentication Service

```typescript
// src/app/core/authentication/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { TokenService } from './token.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {}

  // Verify JWT token on app initialization
  populate() {
    if (this.tokenService.getToken()) {
      this.apiService.get<User>('/api/users/current')
        .subscribe({
          next: (user) => this.setAuth(user),
          error: () => this.purgeAuth()
        });
    } else {
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    this.tokenService.saveToken(user.token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.tokenService.destroyToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.apiService.post<{ token: string; userId: string; email: string; role: string }>('/api/auth/login', credentials)
      .pipe(
        map(response => {
          const user: User = {
            userId: response.userId,
            email: response.email,
            token: response.token,
            role: response.role
          };
          this.setAuth(user);
          return user;
        })
      );
  }

  register(user: { fullName: string; email: string; password: string; phone: string; role?: string }): Observable<any> {
    return this.apiService.post('/api/auth/register', user);
  }

  verifyEmail(data: { email: string; otp: string }): Observable<any> {
    return this.apiService.post('/api/auth/verify-email', data);
  }

  resendOtp(email: string): Observable<any> {
    return this.apiService.post('/api/auth/resend-otp', { email });
  }

  logout(): void {
    this.purgeAuth();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
```

### Token Service

```typescript
// src/app/core/authentication/token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'jwtToken';

  getToken(): string | null {
    return window.localStorage.getItem(this.tokenKey);
  }

  saveToken(token: string): void {
    window.localStorage.setItem(this.tokenKey, token);
  }

  destroyToken(): void {
    window.localStorage.removeItem(this.tokenKey);
  }
}
```

### User Service

```typescript
// src/app/features/user/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../models/user.model';

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
```

### Address Service

```typescript
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
```

### Property Service

```typescript
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
```

### Notification Service

```typescript
// src/app/features/notification/services/notification.service.ts
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
```

### Chat Service

```typescript
// src/app/features/chat/services/chat.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ChatRoom } from '../models/chat-room.model';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private apiService: ApiService) {}

  createChatRoom(chatRoom: Partial<ChatRoom>): Observable<ChatRoom> {
    return this.apiService.post<ChatRoom>('/api/chat-rooms', chatRoom);
  }

  getMessagesByChatRoomId(chatRoomId: number): Observable<ChatMessage[]> {
    return this.apiService.get<ChatMessage[]>(`/api/chat-rooms/${chatRoomId}/messages`);
  }

  sendMessage(message: Partial<ChatMessage>): Observable<ChatMessage> {
    return this.apiService.post<ChatMessage>('/api/chat-messages', message);
  }
}
```

### WebSocket Service

```typescript
// src/app/features/chat/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ChatMessage } from '../models/chat-message.model';
import { TokenService } from '../../../core/authentication/token.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);

  constructor(private tokenService: TokenService) {
    this.client = new Client({
      brokerURL: environment.websocketUrl,
      connectHeaders: {
        Authorization: `Bearer ${this.tokenService.getToken()}`
      },
      debug: function (str) {
        console.log(str);
      }
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
    };
  }

  connect(): void {
    this.client.activate();
  }

  disconnect(): void {
    this.client.deactivate();
  }

  subscribeToChatRoom(roomId: number): Observable<ChatMessage> {
    this.client.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
      const chatMessage: ChatMessage = JSON.parse(message.body);
      this.messageSubject.next(chatMessage);
    });

    return this.messageSubject.asObservable();
  }

  sendMessage(roomId: number, message: ChatMessage): void {
    this.client.publish({
      destination: `/chat/${roomId}/sendMessage`,
      body: JSON.stringify(message)
    });
  }
}
```

### Search Service

```typescript
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
```

## HTTP Interceptors

### Auth Interceptor

```typescript
// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../authentication/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
```

### Error Interceptor

```typescript
// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../authentication/token.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Auto logout if 401 response returned from api
          this.tokenService.destroyToken();
          this.router.navigate(['/login']);
        }

        const errorMessage = error.error?.message || error.statusText;
        return throwError(() => errorMessage);
      })
    );
  }
}
```

## Model Interfaces

### User Model

```typescript
// src/app/core/models/user.model.ts
export interface User {
  userId: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: string;
  token?: string;
  profileImageUrl?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### Property Model

```typescript
// src/app/features/property/models/property.model.ts
import { HouseDetails } from './house-details.model';
import { Address } from '../../user/models/address.model';
import { Location } from './location.model';
import { ServiceType } from './service-type.enum';
import { HouseType } from './house-type.enum';
import { Status } from './status.enum';

export interface Property {
  id: number;
  userId: string;
  title: string;
  description?: string;
  price?: number;
  imageUrls: string[];
  serviceType: ServiceType;
  houseType: HouseType;
  houseDetails: HouseDetails;
  address: Address;
  location: Location;
  availableFrom?: string;
  expiryDate?: string;
  createdAt: string;
  status: Status;
}
```

## Conclusion

This guide provides a foundation for implementing Angular services that integrate with the To-Let backend microservices. By following this structure, you'll create a clean, maintainable codebase that effectively communicates with the backend APIs.

Key points to remember:
1. Use the base ApiService for all HTTP requests
2. Implement feature-specific services that extend or use the base service
3. Use interceptors for authentication and error handling
4. Define clear model interfaces that match the backend DTOs
5. Use environment files to configure API URLs for different environments

As the application grows, you may need to refine these services or add new ones, but this structure provides a solid foundation for scaling the application.

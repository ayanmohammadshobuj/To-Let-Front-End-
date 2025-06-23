// src/app/core/authentication/auth.service.ts
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { TokenService } from './token.service';
import { User } from '../models/user.model';
import { isPlatformBrowser } from "@angular/common";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private jwtHelper = new JwtHelperService()
  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    @Inject(PLATFORM_ID) private platfromId: Object
  ) {
    this.populate(); // Rehydrate authentication state on service initialization
  }

  checkAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  populate() {
    const token = this.tokenService.getToken();

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      try {
        // Decode the token to get user information
        const decodedToken = this.jwtHelper.decodeToken(token);

        // Create a user object from token claims
        const user: User = {
          userId: decodedToken.sub || decodedToken.userId,
          email: decodedToken.email,
          role: decodedToken.role,
          token: token
        };

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing JWT token:', error);
        this.purgeAuth();
      }
    } else {
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    if (user.token) {
      this.tokenService.saveToken(user.token);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      console.error('User token is undefined');
    }
  }

  purgeAuth() {
    this.tokenService.destroyToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.apiService.post<{ accessToken: string; userId: string; email: string; role: string }>('/api/auth/login', credentials)
      .pipe(
        map(response => {
          const user: User = {
            userId: response.userId,
            email: response.email,
            token: response.accessToken, // Map accessToken to token
            role: response.role
          };
          // console.log('User:', user);
          this.setAuth(user);
          return user;
        })
      );
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platfromId)) {
      localStorage.setItem('jwtToken', token);
    }
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

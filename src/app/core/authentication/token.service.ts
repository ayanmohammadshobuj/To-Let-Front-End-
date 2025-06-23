// Fixed TokenService
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'jwtToken';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    if (this.isBrowser) { // Use the already calculated boolean directly
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  saveToken(token: string): void {
    if (this.isBrowser) {
      window.localStorage.setItem(this.tokenKey, token);
    }
  }

  destroyToken(): void {
    if (this.isBrowser) {
      window.localStorage.removeItem(this.tokenKey);
    }
  }
}

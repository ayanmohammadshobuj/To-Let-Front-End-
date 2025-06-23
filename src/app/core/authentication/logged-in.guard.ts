// src/app/core/authentication/logged-in.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        // User is logged in, redirect to home
        router.navigate(['/home']);
        return false;
      }
      // User is not logged in, allow access to login/register
      return true;
    })
  );
};

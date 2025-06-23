import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const currentUser = authService.getCurrentUser();
  const requiredRole = route.data?.['role'];
  return !!(currentUser && currentUser.role === requiredRole);
};

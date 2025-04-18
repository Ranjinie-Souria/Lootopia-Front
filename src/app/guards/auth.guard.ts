import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutePaths } from '../config/route-paths';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('auth_token');
  const router = inject(Router);

  if (token) {
    return true;
  }

  router.navigate([RoutePaths.LOGIN]);
  return false;
};

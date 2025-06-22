import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutePaths } from '../config/route-paths';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (!token) {
    router.navigate([RoutePaths.LOGIN]);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp > now) {
      console.log('Token is valid, proceeding to route');
      return true;
    } else {
      console.log('Token is expired, redirecting to login');
      localStorage.removeItem('auth_token');
      router.navigate([RoutePaths.LOGIN]);
      return false;
    }
  } catch (e) {
    console.error('Invalid token, redirecting to login', e);
    localStorage.removeItem('auth_token');
    router.navigate([RoutePaths.LOGIN]);
    return false;
  }
};

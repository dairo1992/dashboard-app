import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export const notAuthenticatedGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticate = await firstValueFrom(authService.checkStatus());
  if (isAuthenticate) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};

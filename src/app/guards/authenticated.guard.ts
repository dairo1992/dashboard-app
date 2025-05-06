import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const authenticatedGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticate = await firstValueFrom(authService.checkStatus());
  if (!isAuthenticate) {
    router.navigateByUrl('/auth');
    return false;
  }
  return true;
};

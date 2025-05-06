import { inject } from '@angular/core';
import { type CanMatchFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export const isAdminGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  await firstValueFrom(authService.checkStatus());
  return authService.isAdmin();
};

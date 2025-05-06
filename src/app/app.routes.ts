import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import LoginPageComponent from './auth/pages/login-page/login-page.component';
import { notAuthenticatedGuard } from './guards/not-authenticated.guard';
import { authenticatedGuard } from './guards/authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginPageComponent,
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canMatch: [authenticatedGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./modules/home/home.component')
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./modules/usuarios/usuarios.component')
      },
      // { path: '**', redirectTo: 'home' }
    ]
  },
  { path: '**', redirectTo: '/auth' }
];

import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import LoginPageComponent from './auth/pages/login/login-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginPageComponent
  },
  {
    path: '',
    component: LayoutComponent,
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

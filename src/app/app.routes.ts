import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
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
      { path: '**', redirectTo: 'home' }
    ]
  },
  { path: '**', redirectTo: '' }
];

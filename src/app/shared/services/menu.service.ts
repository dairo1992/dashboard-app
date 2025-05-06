import { inject, Injectable, signal } from '@angular/core';
import { MenuItem } from '../components/layout/layout.component';
import { AuthService } from '../../auth/services/auth.service';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Signal para el estado de expansión del menú
  isExpanded = signal<boolean>(false);
  authService = inject(AuthService);
  alertService = inject(AlertService);
  router = inject(Router);

  // Signal para los elementos del menú
  menuItems = signal<MenuItem[]>([
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'icon-[lets-icons--home-duotone]',
      // icon: 'fa-home',
      link: '/home',
      active: true,
      function: () => {
        console.log("inicio");

      }
    },
    {
      id: 'autorizaciones',
      label: 'Autorizaciones',
      icon: 'icon-[lets-icons--check-fill]',
      link: '#',
      active: false,
      function: () => { }
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: 'icon-[fa--users]',
      link: '/usuarios',
      active: false,
      function: () => { }
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: 'icon-[la--store-alt]',
      link: '#',
      active: false,
      function: () => { }
    },
    {
      id: 'transacciones',
      label: 'Transacciones',
      icon: 'icon-[uil--exchange-alt]',
      link: '#',
      active: false,
      function: () => { }
    },
    {
      id: 'cerrar-sesion',
      label: 'Cerrar sesión',
      icon: 'icon-[fluent--sign-out-24-filled]',
      link: '#',
      active: false,
      function: () => {
        this.authService.logout().subscribe({
          next: (value) => {
            this.alertService.info("Hasta pronto");
            this.router.navigateByUrl('/auth');
          }
        })
      }
    },
  ]);

  constructor() { }

  toggleExpanded(): void {
    this.isExpanded.update(current => !current);
  }

  addMenuItem(item: MenuItem): void {
    this.menuItems.update(current => [...current, item]);
  }

  removeMenuItem(id: string): void {
    this.menuItems.update(current => current.filter(item => item.id !== id));
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): void {
    this.menuItems.update(current =>
      current.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }

  setActiveMenuItem(id: string): void {
    this.menuItems.update(current =>
      current.map(item => ({
        ...item,
        active: item.id === id,
        function: () => { }
      }))
    );
  }
}

import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../components/layout/layout.component';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Signal para el estado de expansión del menú
  isExpanded = signal<boolean>(false);

  // Signal para los elementos del menú
  menuItems = signal<MenuItem[]>([
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'fa-home',
      link: '/home',
      active: true
    },
    {
      id: 'autorizaciones',
      label: 'Autorizaciones',
      icon: 'fa-check-circle',
      link: '#',
      active: false
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: 'fa-users',
      link: '#',
      active: false
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: 'fa-store',
      link: '#',
      active: false
    },
    {
      id: 'transacciones',
      label: 'Transacciones',
      icon: 'fa-exchange-alt',
      link: '/usuarios',
      active: false
    },
    {
      id: 'cerrar-sesion',
      label: 'Cerrar sesión',
      icon: 'fa-sign-out-alt',
      link: '#',
      active: false
    },
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'fa-home',
      link: '/home',
      active: true
    },
    {
      id: 'autorizaciones',
      label: 'Autorizaciones',
      icon: 'fa-check-circle',
      link: '#',
      active: false
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: 'fa-users',
      link: '#',
      active: false
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: 'fa-store',
      link: '#',
      active: false
    },
    {
      id: 'transacciones',
      label: 'Transacciones',
      icon: 'fa-exchange-alt',
      link: '/usuarios',
      active: false
    },
    {
      id: 'cerrar-sesion',
      label: 'Cerrar sesión',
      icon: 'fa-sign-out-alt',
      link: '#',
      active: false
    },
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'fa-home',
      link: '/home',
      active: true
    },
    {
      id: 'autorizaciones',
      label: 'Autorizaciones',
      icon: 'fa-check-circle',
      link: '#',
      active: false
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: 'fa-users',
      link: '#',
      active: false
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: 'fa-store',
      link: '#',
      active: false
    },
    {
      id: 'transacciones',
      label: 'Transacciones',
      icon: 'fa-exchange-alt',
      link: '/usuarios',
      active: false
    },
    {
      id: 'cerrar-sesion',
      label: 'Cerrar sesión',
      icon: 'fa-sign-out-alt',
      link: '#',
      active: false
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
        active: item.id === id
      }))
    );
  }
}

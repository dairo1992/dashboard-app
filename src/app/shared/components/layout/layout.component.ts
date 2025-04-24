import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MenuService } from '../../services/menu.service';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from "../alert/alert.component";


export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  link: string;
  active: boolean;
}

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, AlertComponent],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  menuService = inject(MenuService);

  toggleSidebar(): void {
    this.menuService.toggleExpanded();
  }
}

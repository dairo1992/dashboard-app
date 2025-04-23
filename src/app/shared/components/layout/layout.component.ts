import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MenuService } from '../../services/menu.service';
import { RouterOutlet } from '@angular/router';


export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  link: string;
  active: boolean;
}

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  menuService = inject(MenuService);

  toggleSidebar(): void {
    this.menuService.toggleExpanded();
  }
}

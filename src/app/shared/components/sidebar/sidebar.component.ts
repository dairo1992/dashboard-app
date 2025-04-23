import { ChangeDetectionStrategy, Component, input, Input, signal } from '@angular/core';
import { MenuItem } from '../layout/layout.component';
import { MenuItemComponent } from "../menu-item/menu-item.component";

@Component({
  selector: 'sidebar',
  imports: [MenuItemComponent],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,


})
export class SidebarComponent {
  isExpanded = input.required<boolean>();
  menuItems = input.required<MenuItem[]>();

  // Usar signal para el estado de hover de los elementos del menú
  isItemHovered = signal<boolean[]>([]);

  ngOnChanges() {
    // Actualizar el array cuando cambien los elementos del menú
    if (this.menuItems) {
      this.isItemHovered.set(new Array(this.menuItems.length).fill(false));
    }
  }

  showItemText(index: number): void {
    if (!this.isExpanded) {
      const currentValues = [...this.isItemHovered()];
      currentValues[index] = true;
      this.isItemHovered.set(currentValues);
    }
  }

  hideItemText(index: number): void {
    const currentValues = [...this.isItemHovered()];
    currentValues[index] = false;
    this.isItemHovered.set(currentValues);
  }
}

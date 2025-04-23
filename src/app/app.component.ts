// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AppComponent {
  isExpanded = false;
  // Array para rastrear el estado de hover de cada elemento del menú
  isItemHovered: boolean[] = [false, false, false, false, false, false];

  /**
   * Toggles the sidebar menu expansion state
   * @param event - The click event
   */
  toggleMenu(event: Event): void {
    event.preventDefault();
    this.isExpanded = !this.isExpanded;
  }

  /**
   * Shows the tooltip and expands text for a specific menu item
   * @param event - The mouseenter event
   * @param index - Index of the menu item (optional)
   */
  showTooltipAndText(event: Event, index: number = 0): void {
    if (this.isExpanded) return;

    // Marcar este elemento como hover
    this.isItemHovered[index] = true;
  }

  /**
   * Hides the tooltip and collapses text for a specific menu item
   * @param event - The mouseleave event
   * @param index - Index of the menu item (optional)
   */
  hideTooltipAndText(event: Event, index: number = 0): void {
    // Desmarcar este elemento cuando el mouse se retira
    this.isItemHovered[index] = false;
  }
}

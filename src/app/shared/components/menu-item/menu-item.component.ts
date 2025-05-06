import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { MenuItem } from '../layout/layout.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'menu-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .menu-text {
      transition: all 0.2s ease-in-out;
      white-space: nowrap;
    }

    :host:hover .menu-text:not(.hidden) {
      font-weight: 600;
    }
  `]
})
export class MenuItemComponent {
  @Input() item!: MenuItem;
  @Input() isExpanded = false;

  // Signal para el estado de hover
  isHovered = signal<boolean>(false);

  onMouseEnter(): void {
    if (!this.isExpanded) {
      this.isHovered.set(true);
    }
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  function(fnc: Function) {
    fnc();
  }
}

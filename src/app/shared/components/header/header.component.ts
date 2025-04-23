import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isExpanded = false;
  toggleMenu(event: Event): void {
    event.preventDefault();
    this.isExpanded = !this.isExpanded;
  }
}

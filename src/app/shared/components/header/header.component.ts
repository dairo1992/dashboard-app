import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'header',
  imports: [JsonPipe],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    a:hover {
      opacity: 0.8;
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  authService = inject(AuthService);
  user = computed(() => this.authService.user());

  onToggleSidebar(event: Event): void {
    event.preventDefault();
    this.toggleSidebar.emit();
  }
}

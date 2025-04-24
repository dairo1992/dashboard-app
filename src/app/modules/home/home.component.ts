import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  alertService = inject(AlertService);

  mostrarAlerta(): void {
    this.alertService.warning('Operación completada con éxito');
  }
}

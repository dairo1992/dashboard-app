import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, OnDestroy, OnInit, output, signal, WritableSignal } from '@angular/core';
import { finalize, interval, Subscription, takeWhile } from 'rxjs';
import { AlertService, AlertType } from '../../services/alert.service';


@Component({
  selector: 'alert',
  standalone: true,
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnInit, OnDestroy {
  alertService = inject(AlertService);
  messageInput = input<string>('');
  typeInput = input<AlertType>('info');
  autoHideDurationInput = input<number>(5000);

  // Output para notificar cuando la alerta se ha ocultado
  hidden = output<void>();

  // Señales para state interno del componente
  colorBar = signal<string>('');
  currentMessage: WritableSignal<string> = signal('');
  currentType: WritableSignal<AlertType> = signal('info');
  isVisible: WritableSignal<boolean> = signal(false);
  timerProgress: WritableSignal<number> = signal(100);

  // Guardamos un ID para identificar cada alerta mostrada
  private currentAlertId = signal<number>(0);

  private timerSubscription: Subscription | null = null;
  private alertVisibilityEffectRef: ReturnType<typeof effect> | null = null;

  // Definir el effect en el constructor o como una inicialización de campo
  constructor() {
    this.alertVisibilityEffectRef = effect(() => {
      const isVisible = this.alertService.isVisible();
      const serviceAlertId = this.alertService.alertId();

      // Detecta cambios en el ID de alerta o visibilidad
      if (isVisible) {
        // Actualizamos el ID para rastrear esta alerta específica
        this.currentAlertId.set(serviceAlertId);

        // Actualizar información de la alerta
        this.currentMessage.set(this.alertService.message());
        this.currentType.set(this.alertService.type());
        const type = this.alertService.type();
        const color = this.getColorForType(type);
        this.colorBar.set(color);

        // Mostrar alerta y configurar temporizador
        this.isVisible.set(true);
        this.timerProgress.set(100);

        const duration = this.alertService.duration();
        if (duration > 0) {
          this.startTimer(duration);
        } else {
          this.stopTimer();
        }
      } else {
        // Ocultar la alerta cuando el servicio indica que debe ocultarse
        if (this.isVisible()) {
          this.hideAlert();
        }
      }
    });
  }

  ngOnInit(): void {
    // Ya no necesitamos llamar a setupAlertVisibilityEffect aquí
  }

  private getColorForType(type: AlertType): string {
    switch (type) {
      case 'info': return 'bg-info';
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      case 'loading': return 'bg-primary';
      default: return 'bg-info';
    }
  }

  // Este método ahora puede usarse como API directa del componente también
  showAlert(
    message?: string,
    type?: AlertType,
    duration?: number
  ): void {
    const effectiveMessage = message ?? this.messageInput();
    const effectiveType = type ?? this.typeInput();
    const effectiveDuration = (effectiveType === 'loading') ? 0 : (duration ?? this.autoHideDurationInput());

    // Ocultar primero para reiniciar
    this.isVisible.set(false);
    this.stopTimer();

    // Configurar y mostrar después de un breve timeout para permitir que Angular actualice la vista
    setTimeout(() => {
      const color = this.getColorForType(effectiveType);
      this.colorBar.set(color);
      this.currentMessage.set(effectiveMessage);
      this.currentType.set(effectiveType);

      this.isVisible.set(true);
      this.timerProgress.set(100);

      if (effectiveDuration > 0) {
        this.startTimer(effectiveDuration);
      }
    }, 0);
  }

  hideAlert(): void {
    if (this.isVisible()) {
      this.isVisible.set(false);
      this.stopTimer();
      this.timerProgress.set(100); // Reiniciamos la barra de progreso
      this.hidden.emit();
    }
  }

  // Método helper para obtener la clase de alerta de DaisyUI
  alertType(): string {
    return `alert-${this.currentType()}`;
  }

  // Método helper para obtener el mensaje de la alerta
  alertMessage(): string {
    return this.currentMessage();
  }

  private startTimer(duration: number): void {
    this.stopTimer();

    if (duration <= 0) {
      return;
    }

    const intervalDuration = 50;
    const totalSteps = duration / intervalDuration;
    let currentStep = 0;

    this.timerSubscription = interval(intervalDuration)
      .pipe(
        takeWhile(() => currentStep <= totalSteps && this.isVisible()),
        finalize(() => {
          if (this.isVisible()) {
            this.hideAlert();
          }
        })
      )
      .subscribe(() => {
        currentStep++;
        const progress = 100 - (currentStep / totalSteps) * 100;
        this.timerProgress.set(Math.max(0, progress));
      });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();

    // Limpiar el efecto de visibilidad
    if (this.alertVisibilityEffectRef) {
      this.alertVisibilityEffectRef.destroy();
      this.alertVisibilityEffectRef = null;
    }
  }
}

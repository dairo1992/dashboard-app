import { ChangeDetectionStrategy, Component, EventEmitter, input, OnDestroy, output, signal, WritableSignal } from '@angular/core';
import { finalize, interval, Subscription, takeWhile } from 'rxjs';

const AlertType = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error'
} as const;

type AlertType = typeof AlertType[keyof typeof AlertType];

@Component({
  selector: 'alert',
  imports: [],
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnDestroy {
  messageInput = input<string>('');
  typeInput = input<'info' | 'success' | 'warning' | 'error' | 'loading'>('info');
  autoHideDurationInput = input<number>(5000);
  colorBar = signal<string>('');

  hidden = output<void>();

  private currentMessage: WritableSignal<string> = signal('');
  private currentType: WritableSignal<'info' | 'success' | 'warning' | 'error' | 'loading'> = signal('info');
  isVisible: WritableSignal<boolean> = signal(false);
  timerProgress: WritableSignal<number> = signal(100);
  private timerSubscription: Subscription | null = null;

  showAlert(
    message?: string,
    type?: 'info' | 'success' | 'warning' | 'error' | 'loading',
    duration?: number
  ): void {
    const color = type == 'info' ? 'bg-info' : type == 'success' ? 'bg-success' : type == 'warning' ? 'bg-warning' : type == 'loading' ? 'bg-primary' : 'bg-error';
    this.colorBar.set(color);
    this.currentMessage.set(message ?? this.messageInput());
    this.currentType.set(type ?? this.typeInput());
    const effectiveDuration = (this.currentType() === 'loading') ? 0 : (duration ?? this.autoHideDurationInput());

    this.isVisible.set(true);
    this.timerProgress.set(100);
    if (effectiveDuration > 0) {
      this.startTimer(effectiveDuration);
    } else {
      this.stopTimer(); // Aseguramos que no haya temporizador corriendo para 'loading' o alertas manuales.
    }
  }

  hideAlert(): void {
    // Solo procede si la alerta está actualmente visible
    if (this.isVisible()) {
      this.isVisible.set(false); // Oculta la alerta
      this.stopTimer(); // Detiene cualquier temporizador activo
      this.hidden.emit(); // Emite el output 'hidden'
    }
  }

  // Método helper para obtener la clase de alerta de DaisyUI
  alertType(): string {
    return `alert-${this.currentType()}`; // Lee el valor de la signal currentType
  }

  // Método helper para obtener el mensaje de la alerta
  alertMessage(): string {
    return this.currentMessage(); // Lee el valor de la signal currentMessage
  }

  private startTimer(duration: number): void {
    this.stopTimer(); // Detiene cualquier temporizador existente antes de iniciar uno nuevo

    if (duration <= 0) {
      return;
    }

    const intervalDuration = 50; // Frecuencia de actualización de la barra (cada 50ms)
    const totalSteps = duration / intervalDuration; // Número total de "pasos" para completar la duración
    let currentStep = 0; // Contador de pasos
    this.timerSubscription = interval(intervalDuration)
      .pipe(
        takeWhile(() => currentStep <= totalSteps && this.isVisible()), // Usamos isVisible() para leer la signal
        finalize(() => {
          if (this.isVisible()) {
            this.hideAlert();
          }
        })
      )
      .subscribe(() => {
        // En cada emisión del intervalo (cada 50ms):
        currentStep++; // Incrementamos el contador de pasos
        // Calculamos el porcentaje restante de la barra de progreso
        const progress = 100 - (currentStep / totalSteps) * 100;
        // Actualizamos la signal timerProgress. Usamos Math.max(0, progress) para asegurar que no baje de 0.
        this.timerProgress.set(Math.max(0, progress));
      });
  }

  // Detiene el temporizador si está activo
  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Cancela la suscripción al observable
      this.timerSubscription = null; // Limpia la referencia para que pueda ser recolectada por el garbage collector
    }
  }

  // Hook del ciclo de vida: se llama cuando el componente se destruye
  // Es crucial para evitar fugas de memoria al limpiar la suscripción del temporizador
  ngOnDestroy(): void {
    this.stopTimer(); // Asegúrate de detener el temporizador
  }
}

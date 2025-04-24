import { Injectable, signal, Signal } from '@angular/core';

export type AlertType = 'info' | 'success' | 'warning' | 'error' | 'loading';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private messageSignal = signal<string>('');
  private typeSignal = signal<AlertType>('info');
  private durationSignal = signal<number>(5000);
  private visibilitySignal = signal<boolean>(false);
  // Añadimos un identificador único para cada alerta
  private alertIdSignal = signal<number>(0);

  // Señales de solo lectura para ser consumidas por los componentes
  readonly message: Signal<string> = this.messageSignal.asReadonly();
  readonly type: Signal<AlertType> = this.typeSignal.asReadonly();
  readonly duration: Signal<number> = this.durationSignal.asReadonly();
  readonly isVisible: Signal<boolean> = this.visibilitySignal.asReadonly();
  readonly alertId: Signal<number> = this.alertIdSignal.asReadonly();

  constructor() { }

  /**
   * Muestra una alerta con los parámetros especificados
   * @param message Mensaje a mostrar
   * @param type Tipo de alerta: 'info', 'success', 'warning', 'error', 'loading'
   * @param duration Duración en ms. Si es 0, no se autocierra. En alertas de tipo 'loading' siempre es 0.
   */
  showAlert(message: string, type: AlertType = 'info', duration: number = 5000): void {
    // Siempre ocultamos primero para forzar un reinicio completo
    this.visibilitySignal.set(false);

    // Usamos un timeout mínimo para permitir que Angular procese el cambio
    setTimeout(() => {
      this.messageSignal.set(message);
      this.typeSignal.set(type);
      // Si es tipo loading, la duración siempre es 0 (manual)
      this.durationSignal.set(type === 'loading' ? 0 : duration);
      // Incrementamos el ID de la alerta para forzar que el efecto detecte un cambio
      this.alertIdSignal.update(id => id + 1);
      // Mostramos la alerta
      this.visibilitySignal.set(true);
    }, 0);
  }

  /**
   * Muestra una alerta de tipo info
   */
  info(message: string, duration: number = 5000): void {
    this.showAlert(message, 'info', duration);
  }

  /**
   * Muestra una alerta de tipo success
   */
  success(message: string, duration: number = 5000): void {
    this.showAlert(message, 'success', duration);
  }

  /**
   * Muestra una alerta de tipo warning
   */
  warning(message: string, duration: number = 5000): void {
    this.showAlert(message, 'warning', duration);
  }

  /**
   * Muestra una alerta de tipo error
   */
  error(message: string, duration: number = 5000): void {
    this.showAlert(message, 'error', duration);
  }

  /**
   * Muestra una alerta de tipo loading que no se autocierra
   */
  loading(message: string): void {
    this.showAlert(message, 'loading', 0);
  }

  /**
   * Oculta la alerta actual
   */
  hideAlert(): void {
    this.visibilitySignal.set(false);
  }
}

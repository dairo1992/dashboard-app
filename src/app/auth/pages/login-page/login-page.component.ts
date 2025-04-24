import { ChangeDetectionStrategy, Component, inject, signal, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { AlertComponent } from "../../../shared/components/alert/alert.component";



@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export default class LoginPageComponent {
  formutils = FormUtils;
  fb: FormBuilder = inject(FormBuilder);
  loginForm: FormGroup;
  keepLoggedIn: boolean = true;
  @ViewChild(AlertComponent, { static: false }) alertComponent!: AlertComponent;


  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    },
      {
        validators: [FormUtils.camposIguales('password', 'confirmPassword')],
      });
  }

  onSubmit() {
    console.log('Form submitted', this.loginForm.value);

    if (this.loginForm.valid) {
      console.log('Form submitted', this.loginForm.value);
      // Aquí implementarías la lógica de autenticación
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  forgotPassword() {
    // Implementar lógica para recuperar contraseña
    console.log('Forgot password clicked');
  }

  createAccount() {
    // Implementar navegación a la página de registro
    console.log('Create account clicked');
  }

  googleSignIn() {
    // Implementar autenticación con Google
    console.log('Google sign in clicked');
    this.alertComponent.showAlert('Cargando datos...', 'warning');
    // this.alertComponent.showAlert('Iniciando sesión con Google', 'loading');
  }

}

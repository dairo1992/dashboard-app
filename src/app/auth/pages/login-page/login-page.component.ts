import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export default class LoginPageComponent {
  formutils = FormUtils;
  loginForm: FormGroup;
  keepLoggedIn: boolean = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
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
  }
}

import { ChangeDetectionStrategy, Component, inject, signal, Type, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { AlertComponent } from "../../../shared/components/alert/alert.component";
import { AlertService, AlertType } from '../../../shared/services/alert.service';
import { JsonPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export default class LoginPageComponent implements OnInit {

  formutils = FormUtils;
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  keepLoggedIn: boolean = true;
  alertService = inject(AlertService);
  showPassword = signal<boolean>(false);
  router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.loginForm.controls['username'].setValue(username);
      this.loginForm.controls['rememberMe'].setValue(true);
    }
  }


  onSubmit() {
    this.loginForm.markAllAsTouched();
    this.alertService.loading("iniciar sesion");
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username!, this.loginForm.value.password!).subscribe(isAuthenticated => {
        if (isAuthenticated) {
          if (this.loginForm.controls['rememberMe'].value) {
            localStorage.setItem('username', `${this.loginForm.controls['username'].value}`);
          }
          this.alertService.success('Bienvenido');
          this.router.navigateByUrl('/home');
          return;
        }
        this.alertService.error('Usuario o contraseña incorrectos');
      });
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

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword())
  }

}

import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { DatePipe } from '@angular/common';
import { PaginacionComponent } from "../../shared/components/paginacion/paginacion.component";
import { PaginacionService } from 'src/app/shared/components/paginacion/paginacion.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AlertComponent } from "../../shared/components/alert/alert.component";
import { Usuario } from 'src/app/auth/interfaces/Usuario-paginacion';

@Component({
  selector: 'app-usuarios',
  imports: [DatePipe, PaginacionComponent, ReactiveFormsModule, AlertComponent],
  templateUrl: './usuarios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsuariosComponent {
  showPassword = signal<boolean>(false);
  formUtils = FormUtils;
  fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  paginacionService = inject(PaginacionService);
  alertService = inject(AlertService);
  modalRef = viewChild<ElementRef<HTMLDialogElement>>('nuevo_usuario');
  createMutation = this.usuarioService.nuevoUsuario;
  updateMutation = this.usuarioService.actualizarUsuario;


  usuarioForm = this.fb.group(
    {
      id: [0],
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern(this.formUtils.emailPattern)]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
    },
    {
      validators: [this.formUtils.camposIguales('password', 'password_confirmation')],
    }
  );

  get usuariosQuery() {
    return this.usuarioService.usuariosQuery;
  }

  modalUsuario(usuario: Usuario | null = null) {
    if (this.modalRef()) {
      if (usuario) {
        this.usuarioForm.patchValue(usuario);
      } else {
        this.usuarioForm.reset();
      }
      this.modalRef()!.nativeElement.showModal();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword())
  }

  registrarUsuario() {
    this.usuarioForm.markAllAsTouched();
    this.alertService.loading("Enviando datos al servidor..");
    if (this.usuarioForm.valid) {
      const formValues = this.usuarioForm.value;
      if (formValues.id && formValues.id > 0) {
        this.updateMutation.mutate(formValues);
      } else {
        this.createMutation.mutate(formValues);
      }
      this.modalRef()!.nativeElement.close();
      this.usuarioForm.reset();
    }
  }
}

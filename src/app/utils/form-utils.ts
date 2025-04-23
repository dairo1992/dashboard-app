import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

export class FormUtils {

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static getTextError(errors: ValidationErrors, errorMessage: string = ''): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Minimo requerido es de ${errors['minlength'].requiredLength} caracteres`;

        case 'min':
          return `Valor minimo requerido es de ${errors['min'].min}`;

        case 'email':
          return `Este no parece ser un correo valido`;

        case 'pattern':
          return errorMessage;

        case 'emailValid':
          return errorMessage;

        case 'notStrider':
          return 'Este usuario no es permitido';

        default: return `Error de validacion no controlado: ${key}`;
      }
    }
    return null;
  }
  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (!!form.controls[fieldName].errors && form.controls[fieldName].touched);
  }

  static getFieldError(form: FormGroup, fieldName: string, errorMessage: string = ''): string | null {
    if (!form.controls[fieldName]) return null;
    const errors = form.controls[fieldName].errors ?? {};
    return this.getTextError(errors, errorMessage);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (formArray.controls[index].errors && formArray.controls[index].touched);
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    if (formArray.controls.length === 0) return null;
    const errors = formArray.controls[index].errors ?? {};
    return this.getTextError(errors);
  }

  static camposIguales(campo1: string, campo2: string) {
    return (formGroup: AbstractControl) => {
      const field1 = formGroup.get(campo1)?.value;
      const field2 = formGroup.get(campo2)?.value;
      return field1 !== field2 ? { noIguales: true } : null;
    }
  }

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    await sleep();
    const formValue = control.value;
    if (formValue === 'hola@mundo.com') {
      return { emailValid: true };
    }
    return null;
  }

  static notStrider(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim().toLowerCase();
    return value === 'strider' ? { notStrider: true } : null;
  }
}

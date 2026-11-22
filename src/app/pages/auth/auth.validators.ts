import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isValidCpf } from '../../core/utils/cpf';

/** CPF com 11 dígitos e dígitos verificadores corretos (campo vazio passa: use `required` junto). */
export const cpfValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  !control.value || isValidCpf(String(control.value)) ? null : { cpf: true };

/** Login aceita e-mail ou CPF. */
export const emailOrCpfValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  if (!value) return null;
  return (value.includes('@') && Validators.email(control) === null) || isValidCpf(value) ? null : { emailOrCpf: true };
};

/** O campo precisa ser igual a outro do mesmo formulário (ex.: confirmar senha). */
export const matchValidator =
  (otherName: string): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const other = control.parent?.get(otherName);
    return !other || control.value === other.value ? null : { mismatch: true };
  };

/** Telefone opcional: DDD + 8 ou 9 dígitos, com ou sem máscara. */
export const phonePattern = Validators.pattern(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/);

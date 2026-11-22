import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Rótulo + campo + mensagem de erro. O <input> entra por projeção (ng-content) e o botão do olho da senha
 * por [suffix]. Usa detecção padrão porque o estado do FormControl muda fora deste componente.
 */
@Component({
  selector: 'app-auth-field',
  standalone: false,
  templateUrl: './auth-field.component.html',
  styleUrl: './auth-field.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AuthFieldComponent {
  readonly label = input.required<string>();
  /** Mesmo id do <input>, para o rótulo funcionar. */
  readonly for = input.required<string>();
  readonly control = input.required<AbstractControl>();
  /** Mostra erros também em campos ainda não tocados (depois de tentar enviar). */
  readonly submitted = input(false);
  readonly hint = input('');

  protected errorMessage(): string | null {
    const control = this.control();
    const errors = control.errors;
    if (!errors || !(control.touched || control.dirty || this.submitted())) return null;
    if (errors['server']) return String(errors['server']);
    if (errors['required']) return 'Campo obrigatório';
    if (errors['emailOrCpf']) return 'Informe um e-mail ou CPF válido';
    if (errors['email']) return 'E-mail inválido';
    if (errors['cpf']) return 'CPF inválido';
    if (errors['pattern']) return 'Formato inválido';
    if (errors['minlength']) return `Use pelo menos ${errors['minlength'].requiredLength} caracteres`;
    if (errors['mismatch']) return 'As senhas não conferem';
    return 'Valor inválido';
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toApiError } from '../../../../core/api/api-error';
import { AuthService, safeRedirect } from '../../../../core/auth/auth.service';
import { formatCpf } from '../../../../core/utils/cpf';
import { cpfValidator, matchValidator, phonePattern } from '../../auth.validators';

/** Cadastro: cria o usuário (nome, CPF, e-mail, telefone e senha) e já entra com o JWT devolvido. */
@Component({
  selector: 'app-register-form',
  standalone: false,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, cpfValidator]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', phonePattern],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', [Validators.required, matchValidator('password')]],
  });
  protected readonly submitted = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly redirect = this.route.snapshot.queryParamMap.get('redirect');

  constructor() {
    // mudou a senha: confere de novo a confirmação
    this.form.controls.password.valueChanges.subscribe(() => this.form.controls.confirm.updateValueAndValidity());
  }

  protected maskCpf(event: Event): void {
    this.form.controls.cpf.setValue(formatCpf((event.target as HTMLInputElement).value));
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.busy.set(true);
    try {
      await this.auth.register({ nome: v.name, cpf: v.cpf, email: v.email, telefone: v.phone, senha: v.password });
      await this.router.navigateByUrl(safeRedirect(this.redirect));
    } catch (e) {
      const err = toApiError(e);
      // a API aponta os campos com problema: mostra a mensagem em cada um
      const fields: Record<string, 'name' | 'cpf' | 'email' | 'phone' | 'password'> = {
        nome: 'name', cpf: 'cpf', email: 'email', telefone: 'phone', senha: 'password',
      };
      let placed = false;
      for (const d of err.details) {
        const key = fields[d.campo];
        if (key) {
          this.form.controls[key].setErrors({ server: d.mensagem });
          placed = true;
        }
      }
      this.error.set(placed ? 'Corrija os campos destacados.' : err.message);
    } finally {
      this.busy.set(false);
    }
  }
}

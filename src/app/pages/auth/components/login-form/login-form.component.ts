import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toApiError } from '../../../../core/api/api-error';
import { AuthService, safeRedirect } from '../../../../core/auth/auth.service';
import { emailOrCpfValidator } from '../../auth.validators';

/** Formulário de login: e-mail ou CPF + senha. O backend devolve o JWT. */
@Component({
  selector: 'app-login-form',
  standalone: false,
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    login: ['', [Validators.required, emailOrCpfValidator]],
    password: ['', Validators.required],
    remember: [true],
  });
  protected readonly submitted = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  /** Destino depois do login (?redirect=), só se for um caminho interno. */
  protected readonly redirect = this.route.snapshot.queryParamMap.get('redirect');

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { login, password, remember } = this.form.getRawValue();
    this.busy.set(true);
    try {
      await this.auth.login(login, password, remember);
      await this.router.navigateByUrl(safeRedirect(this.redirect));
    } catch (e) {
      const err = toApiError(e);
      this.error.set(err.status === 401 ? 'E-mail, CPF ou senha incorretos.' : err.message);
    } finally {
      this.busy.set(false);
    }
  }
}
